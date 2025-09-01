import { factories } from '@strapi/strapi';
import { parse } from 'csv-parse';
import * as fs from 'fs';

export default factories.createCoreService(
  'api::import.import',
  ({ strapi }) => ({
    async importFromCSV(
      csvFilePath,
      collectionUid,
      fieldMappings,
      options: any = {}
    ) {
      options = options || {};
      const user = options.assigned_user || {};
      const assigned_user = user.id || undefined;
      // log to imports collection
      await strapi.db.query('api::import.import').create({
        data: {
          fileName: options.uploadedFile?.name || csvFilePath,
          filePath: options.uploadedFile?.url || csvFilePath,
          importStatus: 'started',
          fieldMappings,
          total: options.totalRows || 0,
          success: 0,
          error: 0,
          assigned_user,
        },
      });

      const parser = fs
        .createReadStream(csvFilePath)
        .pipe(parse({ columns: true, skip_empty_lines: true }));

      for await (const record of parser) {
        const mappedRecord = await this.loadCSVDataWithFieldMapping(
          record,
          fieldMappings,
          user
        );
        // check service have method createOrUpdate
        if (strapi.service(collectionUid).createOrUpdate) {
          await strapi.service(collectionUid).createOrUpdate(mappedRecord);
        } else {
          this.createOrUpdate(collectionUid, mappedRecord);
        }
      }

      return true;
    },

    async loadCSVDataWithFieldMapping(record, fieldMappings, user: any = {}) {
      const assigned_user = user?.id || undefined;
      const mappedRecord: any = {};
      fieldMappings.forEach((mapping) => {
        const csvField = mapping.csvHeader;
        const contentTypeField = mapping.contentTypeField;
        mappedRecord[contentTypeField] = record[csvField] || null;
      });

      mappedRecord.assigned_user = assigned_user;

      return mappedRecord;
    },

    convertToCSV(data, fields, headers) {
      // Create CSV header row
      const csvRows = [];
      csvRows.push(
        headers.map((header) => this.escapeCSVField(header)).join(',')
      );

      // Convert each record to CSV row
      data.forEach((record) => {
        const row = fields.map((field) => {
          let value = record[field];

          // Handle different data types
          if (value === null || value === undefined) {
            return '';
          }

          // Handle dates
          if (
            value instanceof Date ||
            (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/))
          ) {
            value = new Date(value).toISOString().split('T')[0]; // Format as YYYY-MM-DD
          }

          // Handle objects/arrays (stringify them)
          if (typeof value === 'object') {
            value = JSON.stringify(value);
          }

          // Handle boolean
          if (typeof value === 'boolean') {
            value = value ? 'true' : 'false';
          }

          return this.escapeCSVField(String(value));
        });

        csvRows.push(row.join(','));
      });

      return csvRows.join('\n');
    },

    escapeCSVField(field) {
      // Escape CSV field by wrapping in quotes if it contains comma, quote, or newline
      if (
        field.includes(',') ||
        field.includes('"') ||
        field.includes('\n') ||
        field.includes('\r')
      ) {
        // Escape quotes by doubling them
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    },

    async createOrUpdate(collectionUid: any, mappedRecord: any) {
      let existRecord = null;
      // check duplicated
      if (strapi.service(collectionUid).checkDuplicate) {
        existRecord = await strapi
          .service(collectionUid)
          .checkDuplicate(mappedRecord);
      }

      if (existRecord?.id) {
        // update
        await strapi.db
          .query(collectionUid)
          .update({ where: { id: existRecord.id }, data: mappedRecord });
      } else {
        // create
        await strapi.db.query(collectionUid).create({ data: mappedRecord });
      }
    },
  })
);
