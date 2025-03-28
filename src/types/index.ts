// Types definitions for the application

// QR Code related types
export interface QRCodeDetails {
  qr_id: string;
  subject: string;
  context: string;
  narrative: string;
  land_riv: string; // URL to landscape Rive animation
  port_riv: string; // URL to portrait Rive animation
}

export interface QRCodeCreateRequest {
  qr_code: string;
  subject: string;
  context: string;
  narrative: string;
  image_url: string;
}

// Media related types
export interface SignedUrlResponse {
  s3url: string;
  id: string;
}

export interface MediaFile {
  uri: string;
  type: 'photo' | 'video';
  name: string;
  size?: number;
  id?: string;
}

// Twitter related types
export interface TwitterLinkResponse {
  twitter_link: string;
}

// API response types
export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

// Error types
export interface ApiError {
  code: number;
  message: string;
}

// Application state types
export interface AppState {
  isLoading: boolean;
  error: ApiError | null;
  scannedQRCode: string | null;
  qrDetails: QRCodeDetails | null;
  capturedMedia: MediaFile[];
  uploadProgress: number;
  isUploading: boolean;
  twitterShareLink: string | null;
}

// Camera state
export interface CameraState {
  isActive: boolean;
  hasCameraPermission: boolean | null;
  hasStoragePermission: boolean | null;
  flashMode: 'off' | 'on';
  deviceOrientation: 'portrait' | 'landscape';
}
