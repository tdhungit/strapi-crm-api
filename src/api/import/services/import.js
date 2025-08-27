'use strict';

const fs = require('fs');
const { parse } = require('csv-parse');

// @ts-ignore
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::import.import', ({ strapi }) => ({
  async importFromCSV(csvFilePath, collectionUid, fieldMappings, options = {}) {
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
      // check service have method createOrUpdate
      if (strapi.service(collectionUid).createOrUpdate) {
        const mappedRecord = await this.loadCSVDataWithFieldMapping(record, fieldMappings, user);
        await strapi.service(collectionUid).createOrUpdate(mappedRecord);
      }
    }

    return true;
  },

  async loadCSVDataWithFieldMapping(record, fieldMappings, user = {}) {
    const assigned_user = user?.id || undefined;
    const mappedRecord = {};
    fieldMappings.forEach((mapping) => {
      const csvField = mapping.csvHeader;
      const contentTypeField = mapping.contentTypeField;
      mappedRecord[contentTypeField] = record[csvField] || null;
    });

    mappedRecord.assigned_user = assigned_user;

    return mappedRecord;
  },
}));
