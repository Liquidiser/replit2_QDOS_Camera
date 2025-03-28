# QDOS Camera App API Documentation

This document outlines the API endpoints and data structures used in the QDOS Camera App.

## Base URL

```
https://qdos-api.liquidiser.co.uk/api
```

## Authentication

API requests are authenticated using an API key provided in the request headers.

```
x-api-key: YOUR_API_KEY
```

## Endpoints

### QR Code Operations

#### 1. Get QR Code Details

Retrieves information about a QR code by its ID.

- **Endpoint**: `/qr/{qrId}`
- **Method**: GET
- **Parameters**:
  - `qrId` (path parameter): The unique identifier of the QR code

**Response:**
```json
{
  "status": "success",
  "data": {
    "qr_id": "QR123456",
    "subject": "Historical Monument",
    "context": "18th Century Architecture",
    "narrative": "This building was constructed in 1756...",
    "land_riv": "https://rive-app.s3.amazonaws.com/landscape_animation.riv",
    "port_riv": "https://rive-app.s3.amazonaws.com/portrait_animation.riv"
  }
}
```

#### 2. Create QR Code Post

Creates a new QR code post with associated media and information.

- **Endpoint**: `/qr`
- **Method**: POST
- **Body**:
  ```json
  {
    "qr_code": "QR123456",
    "subject": "Historical Monument",
    "context": "18th Century Architecture",
    "narrative": "This building was constructed in 1756...",
    "image_url": "https://example.com/media/image123.jpg"
  }
  ```

**Response:**
```json
{
  "status": "success",
  "message": "QR code post created successfully"
}
```

#### 3. Delete QR Code

Deletes a QR code entry by its ID.

- **Endpoint**: `/qr/{qrId}`
- **Method**: DELETE
- **Parameters**:
  - `qrId` (path parameter): The unique identifier of the QR code

**Response:**
```json
{
  "status": "success",
  "message": "QR code deleted successfully"
}
```

### Media Operations

#### 1. Get Signed URL for Upload

Obtains a pre-signed URL for direct media upload to storage.

- **Endpoint**: `/media/signed-url`
- **Method**: GET

**Response:**
```json
{
  "status": "success",
  "data": {
    "s3url": "https://s3-bucket.aws.com/upload-url?signature=xyz",
    "id": "media-123456"
  }
}
```

### Social Media Operations

#### 1. Generate Twitter Share Link

Creates a Twitter share link for a specific QR code.

- **Endpoint**: `/social/twitter/{qrId}`
- **Method**: GET
- **Parameters**:
  - `qrId` (path parameter): The unique identifier of the QR code

**Response:**
```json
{
  "status": "success",
  "data": {
    "twitter_link": "https://twitter.com/intent/tweet?text=Check%20out%20this%20QR%20code&url=https%3A%2F%2Fqdos.example.com%2Fqr%2FQR123456"
  }
}
```

## Data Structures

### QRCodeDetails

```typescript
{
  qr_id: string;
  subject: string;
  context: string;
  narrative: string;
  land_riv: string; // URL to landscape Rive animation
  port_riv: string; // URL to portrait Rive animation
}
```

### QRCodeCreateRequest

```typescript
{
  qr_code: string;
  subject: string;
  context: string;
  narrative: string;
  image_url: string;
}
```

### SignedUrlResponse

```typescript
{
  s3url: string;
  id: string;
}
```

### TwitterLinkResponse

```typescript
{
  twitter_link: string;
}
```

### ApiResponse

```typescript
{
  status: string;
  data?: any;
  message?: string;
}
```

### ApiError

```typescript
{
  code: number;
  message: string;
}
```

## Error Handling

The API returns standard HTTP status codes to indicate the success or failure of a request.

Common error codes:
- `400` - Bad Request: The request was malformed or contains invalid parameters
- `401` - Unauthorized: API key is missing or invalid
- `404` - Not Found: The requested resource was not found
- `500` - Internal Server Error: An error occurred on the server

Error responses follow this format:
```json
{
  "status": "error",
  "error": {
    "code": 404,
    "message": "QR code not found"
  }
}
```

## Best Practices

1. Always include the API key in each request
2. Handle error responses appropriately in your client application
3. Validate user input before making API calls
4. Implement caching for frequently accessed resources
5. Handle network failures gracefully with appropriate retries and timeouts