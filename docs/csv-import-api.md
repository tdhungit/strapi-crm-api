# CSV Import/Export API Documentation

## Overview

The CSV Import/Export API allows you to upload CSV files from the frontend and automatically import the data into your Strapi collections, as well as export collection data to CSV format.

## Endpoints

### 1. Upload and Import CSV

**POST** `/api/import/csv`

Upload a CSV file and import its data into a specified collection.

#### Request

- **Method**: POST
- **Content-Type**: multipart/form-data
- **Authentication**: Required (Bearer token)

#### Parameters

- `file` (file, required): The CSV file to upload
- `collectionUid` (string, required): The UID of the collection to import data into (e.g., "api::contact.contact", "api::account.account")

#### Example Request (JavaScript/Fetch)

```javascript
const formData = new FormData();
formData.append('file', csvFile); // csvFile is a File object
formData.append('collectionUid', 'api::contact.contact');

const response = await fetch('/api/import/csv', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const result = await response.json();
```

#### Example Request (cURL)

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@contacts.csv" \
  -F "collectionUid=api::contact.contact" \
  http://localhost:1337/api/import/csv
```

#### Response

```json
{
  "message": "CSV file uploaded and processed successfully",
  "file": {
    "id": 1,
    "name": "contacts.csv",
    "url": "/uploads/contacts_abc123.csv",
    "size": 1024
  },
  "importResult": true,
  "collectionUid": "api::contact.contact"
}
```

### 2. Get Import History

**GET** `/api/import/history`

Retrieve a list of previously uploaded CSV files.

#### Request

- **Method**: GET
- **Authentication**: Required (Bearer token)

#### Response

```json
{
  "data": [
    {
      "id": 1,
      "name": "contacts.csv",
      "url": "/uploads/contacts_abc123.csv",
      "size": 1024,
      "createdAt": "2023-12-01T10:00:00.000Z",
      "createdBy": {
        "id": 1,
        "username": "admin"
      }
    }
  ]
}
```

### 3. Export Collection to CSV

**GET** `/api/exports/csv`

Export data from a collection to CSV format with field names as headers.

#### Request

- **Method**: GET
- **Authentication**: Required (Bearer token)

#### Parameters

- `module` (string, required): The collection name to export (e.g., "contacts", "accounts")
- `filters` (object, optional): Strapi filters to apply to the data
- `sort` (array, optional): Sort order for the data (default: ["id:asc"])

#### Example Request (JavaScript/Fetch)

```javascript
const response = await fetch('/api/exports/csv?module=contacts', {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// The response will be a CSV file download
const csvData = await response.text();
```

#### Example Request with Filters (cURL)

```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:1337/api/exports/csv/contacts?filters[name][\$contains]=John"
```

#### Response

The response will be a CSV file with:

- **Content-Type**: `text/csv`
- **Content-Disposition**: `attachment; filename="contacts_export_2023-12-01.csv"`
- **Body**: CSV data with field names as headers

Example CSV output:

```csv
id,name,email,phone,company,createdAt,updatedAt
1,John Doe,john@example.com,+1234567890,Acme Corp,2023-12-01,2023-12-01
2,Jane Smith,jane@example.com,+0987654321,Tech Inc,2023-12-01,2023-12-01
```

## CSV File Format

### Requirements

- File must have a `.csv` extension
- First row should contain column headers
- Column headers should match the field names in your Strapi collection
- Empty lines are automatically skipped

### Example CSV for Contacts

```csv
name,email,phone,company
John Doe,john@example.com,+1234567890,Acme Corp
Jane Smith,jane@example.com,+0987654321,Tech Inc
```

### Example CSV for Accounts

```csv
name,email,website,industry
Acme Corporation,contact@acme.com,https://acme.com,Technology
Tech Solutions,info@techsol.com,https://techsol.com,Consulting
```

## Collection UIDs

Common collection UIDs in this CRM system:

- `api::contact.contact` - For contacts
- `api::account.account` - For accounts
- `plugin::users-permissions.user` - For users

## Error Handling

### Common Error Responses

#### 400 Bad Request

```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "No CSV file uploaded"
  }
}
```

#### 400 Bad Request - Invalid Collection

```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Collection api::invalid.collection does not exist"
  }
}
```

#### 401 Unauthorized

```json
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Missing or invalid credentials"
  }
}
```

#### 500 Internal Server Error

```json
{
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "An error occurred while uploading the CSV file: [error details]"
  }
}
```

## Notes

1. **File Size Limit**: Default maximum file size is 50MB (configurable in `config/plugins.js`)
2. **Data Validation**: The import process uses the existing `createOrUpdate` method if available in the target collection's service
3. **File Storage**: Uploaded files are stored using Strapi's upload plugin and can be accessed via the returned URL
4. **Cleanup**: Temporary files are automatically cleaned up after processing
5. **Authentication**: All endpoints require authentication with a valid Bearer token

## Frontend Integration Example

```javascript
// React component example
const CSVUpload = () => {
  const [file, setFile] = useState(null);
  const [collectionUid, setCollectionUid] = useState('api::contact.contact');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('collectionUid', collectionUid);

    try {
      const response = await fetch('/api/import/csv', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert('CSV imported successfully!');
      } else {
        alert('Error: ' + result.error.message);
      }
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type='file' accept='.csv' onChange={(e) => setFile(e.target.files[0])} />
      <select value={collectionUid} onChange={(e) => setCollectionUid(e.target.value)}>
        <option value='api::contact.contact'>Contacts</option>
        <option value='api::account.account'>Accounts</option>
      </select>
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload CSV'}
      </button>
    </div>
  );
};

// Export component example
const CSVExport = () => {
  const [module, setModule] = useState('contacts');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);

    try {
      const response = await fetch(`/api/exports/csv?module=${module}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${module}_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        alert('CSV exported successfully!');
      } else {
        const error = await response.json();
        alert('Error: ' + error.error.message);
      }
    } catch (error) {
      alert('Export failed: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <select value={module} onChange={(e) => setModule(e.target.value)}>
        <option value='contacts'>Contacts</option>
        <option value='accounts'>Accounts</option>
      </select>
      <button onClick={handleExport} disabled={exporting}>
        {exporting ? 'Exporting...' : 'Export to CSV'}
      </button>
    </div>
  );
};
```
