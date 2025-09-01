import { factories } from '@strapi/strapi';
import * as fs from 'fs';

export default factories.createCoreController(
  'api::import.import',
  ({ strapi }) => ({
    async uploadCSVImport(ctx) {
      const user = ctx.state.user;
      try {
        // Get collection UID from request body or query
        const { module } = ctx.request.body || ctx.query;
        if (!module) {
          return ctx.badRequest('Module is required');
        }

        const { fieldMappings, totalRows } = ctx.request.body;
        if (!fieldMappings) {
          return ctx.badRequest('Field mapping is required');
        }

        // Validate that the collection exists
        const contentType = await strapi
          .service('api::metadata.metadata')
          .getContentTypeFromCollectionName(module);
        if (!contentType) {
          return ctx.badRequest(`Collection ${module} does not exist`);
        }

        // Check if file is uploaded
        const { files } = ctx.request;
        if (!files || Object.keys(files).length === 0) {
          return ctx.badRequest('No CSV file uploaded');
        }

        // Support any field name; fall back to the first file-like entry
        const uploadedFile =
          files.file ||
          files.files ||
          files.csv ||
          files.upload ||
          files.data ||
          files[Object.keys(files)[0]];

        // Handle case where uploadedFile might be an array
        const fileObj: any = Array.isArray(uploadedFile)
          ? uploadedFile[0]
          : uploadedFile;

        // Get the correct file path - try different property names
        const filePath =
          fileObj.filepath || fileObj.path || fileObj.tempFilePath;
        const fileName =
          fileObj.originalFilename || fileObj.name || fileObj.filename;
        const fileType = fileObj.mimetype || fileObj.type || fileObj.mimeType;

        if (!filePath) {
          return ctx.badRequest('File path is not available');
        }

        if (!fileName) {
          return ctx.badRequest('File name is not available');
        }

        // Validate file type
        if (!fileName.toLowerCase().endsWith('.csv')) {
          return ctx.badRequest('Only CSV files are allowed');
        }

        // If fieldMappings is a string (from multipart forms), parse it
        let normalizedFieldMappings = fieldMappings;
        if (typeof normalizedFieldMappings === 'string') {
          try {
            normalizedFieldMappings = JSON.parse(normalizedFieldMappings);
          } catch (e) {
            return ctx.badRequest('Field mapping must be valid JSON');
          }
        }

        // Use Strapi's upload plugin to save the file
        const uploadService = strapi.plugin('upload').service('upload');
        // Upload file using Strapi's upload service
        const [uploadedFileRecord] = await uploadService.upload({
          data: {
            fileInfo: {
              name: fileName,
              caption: `CSV import for ${module}`,
              alternativeText: `CSV import file`,
            },
          },
          files: fileObj,
        });

        // Process the CSV file using the existing import service
        // Use the temporary file path for processing since it's more reliable
        const importService = strapi.service('api::import.import');
        const result = await importService.importFromCSV(
          filePath,
          contentType.uid,
          normalizedFieldMappings,
          {
            totalRows,
            uploadedFile: uploadedFileRecord,
            assigned_user: user,
          }
        );

        // Clean up temporary file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        return ctx.send({
          message: 'CSV file uploaded and processed successfully',
          file: {
            id: uploadedFileRecord.id,
            name: uploadedFileRecord.name,
            url: uploadedFileRecord.url,
            size: uploadedFileRecord.size,
          },
          importResult: result,
          collectionUid: contentType.uid,
          collectionName: contentType.collectionName,
        });
      } catch (error) {
        strapi.log.error('Error uploading CSV file:', error);

        // Clean up temporary file in case of error
        const errorFiles: any = ctx.request.files || {};
        const errorFileObjBase =
          errorFiles.file ||
          errorFiles.files ||
          errorFiles.csv ||
          errorFiles.upload ||
          errorFiles.data ||
          (Object.keys(errorFiles).length
            ? errorFiles[Object.keys(errorFiles)[0]]
            : undefined);
        const errorFileObj = Array.isArray(errorFileObjBase)
          ? errorFileObjBase[0]
          : errorFileObjBase;
        const errorFilePath =
          errorFileObj?.filepath ||
          errorFileObj?.path ||
          errorFileObj?.tempFilePath;
        if (errorFilePath && fs.existsSync(errorFilePath)) {
          try {
            fs.unlinkSync(errorFilePath);
          } catch (cleanupError) {
            strapi.log.error('Error cleaning up temporary file:', cleanupError);
          }
        }

        return ctx.internalServerError(
          'An error occurred while uploading the CSV file: ' + error.message
        );
      }
    },

    async exportToCSV(ctx) {
      try {
        // Get collection UID from request params
        const { module } = ctx.params;
        if (!module) {
          return ctx.badRequest('Module is required');
        }

        const filters: any = ctx.query.filters || {};
        const sort: any = ctx.query.sort || ['id:asc'];

        // Get content type information
        const contentType = await strapi
          .service('api::metadata.metadata')
          .getContentTypeFromCollectionName(module);
        if (!contentType) {
          return ctx.badRequest(`Collection ${module} does not exist`);
        }

        // Get the content type schema to determine exportable fields
        const schema = strapi.contentType(contentType.uid);
        const attributes = schema.attributes;

        // Filter out non-exportable fields (relations, passwords, etc.)
        const exportableFields = [];
        const fieldLabels = [];

        for (const [fieldName, fieldConfig] of Object.entries(attributes)) {
          // Skip system fields and complex relations
          if (
            !['createdBy', 'updatedBy', 'localizations'].includes(fieldName) &&
            (fieldConfig as any).type !== 'password' &&
            (fieldConfig as any).type !== 'relation' &&
            !(fieldConfig as any).private
          ) {
            exportableFields.push(fieldName);
            // Use displayName if available, otherwise use field name
            fieldLabels.push((fieldConfig as any).displayName || fieldName);
          }
        }

        // Fetch data from the collection
        const assignedFilter = await strapi
          .service('api::user.user')
          .assignFilter(ctx.state.user.id, module);
        const entities = await strapi.entityService.findMany(contentType.uid, {
          filters: {
            ...filters,
            ...assignedFilter,
          },
          sort: sort as string[],
          populate: '*', // Populate relations for better export
        });

        // Convert data to CSV format
        const csvData = strapi
          .service('api::import.import')
          .convertToCSV(entities, exportableFields, fieldLabels);

        // Set response headers for file download
        const filename = `${module}_export_${new Date().toISOString().split('T')[0]}.csv`;
        ctx.set('Content-Type', 'text/csv');
        ctx.set('Content-Disposition', `attachment; filename="${filename}"`);

        return ctx.send(csvData);
      } catch (error) {
        strapi.log.error('Error exporting to CSV:', error);
        return ctx.internalServerError(
          'An error occurred while exporting to CSV: ' + error.message
        );
      }
    },
  })
);
