import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { permissionUtils } from '../utils/permissions';
import { QRCodeDetails, MediaFile, ApiError } from '../types';

// Define the state shape
interface AppState {
  // QR-related state
  scannedQRCode: string | null;
  qrDetails: QRCodeDetails | null;
  
  // Media-related state
  capturedMedia: MediaFile[];
  selectedMedia: MediaFile | null;
  
  // Upload-related state
  isUploading: boolean;
  uploadProgress: number;
  uploadedUrl: string | null;
  
  // Permission-related state
  hasCameraPermission: boolean | null;
  hasStoragePermission: boolean | null;
  
  // General state
  isLoading: boolean;
  error: ApiError | null;
}

// Define the actions
type AppAction =
  | { type: 'SET_QR_CODE', payload: string | null }
  | { type: 'SET_QR_DETAILS', payload: QRCodeDetails | null }
  | { type: 'ADD_MEDIA', payload: MediaFile }
  | { type: 'REMOVE_MEDIA', payload: string } // URI of media to remove
  | { type: 'SELECT_MEDIA', payload: MediaFile | null }
  | { type: 'CLEAR_ALL_MEDIA' }
  | { type: 'SET_UPLOADING', payload: boolean }
  | { type: 'SET_UPLOAD_PROGRESS', payload: number }
  | { type: 'SET_UPLOADED_URL', payload: string | null }
  | { type: 'SET_CAMERA_PERMISSION', payload: boolean | null }
  | { type: 'SET_STORAGE_PERMISSION', payload: boolean | null }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_ERROR', payload: ApiError | null }
  | { type: 'RESET_STATE' };

// Create the context
interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Initial state
const initialState: AppState = {
  scannedQRCode: null,
  qrDetails: null,
  capturedMedia: [],
  selectedMedia: null,
  isUploading: false,
  uploadProgress: 0,
  uploadedUrl: null,
  hasCameraPermission: null,
  hasStoragePermission: null,
  isLoading: false,
  error: null,
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_QR_CODE':
      return { ...state, scannedQRCode: action.payload };
    
    case 'SET_QR_DETAILS':
      return { ...state, qrDetails: action.payload };
    
    case 'ADD_MEDIA':
      return { 
        ...state, 
        capturedMedia: [...state.capturedMedia, action.payload],
        selectedMedia: action.payload, // Auto-select newly added media
      };
    
    case 'REMOVE_MEDIA':
      return { 
        ...state, 
        capturedMedia: state.capturedMedia.filter(media => media.uri !== action.payload),
        // If selected media was removed, set to null or the first available item
        selectedMedia: state.selectedMedia?.uri === action.payload 
          ? (state.capturedMedia.filter(media => media.uri !== action.payload)[0] || null)
          : state.selectedMedia,
      };
    
    case 'SELECT_MEDIA':
      return { ...state, selectedMedia: action.payload };
    
    case 'CLEAR_ALL_MEDIA':
      return { ...state, capturedMedia: [], selectedMedia: null };
    
    case 'SET_UPLOADING':
      return { ...state, isUploading: action.payload };
    
    case 'SET_UPLOAD_PROGRESS':
      return { ...state, uploadProgress: action.payload };
    
    case 'SET_UPLOADED_URL':
      return { ...state, uploadedUrl: action.payload };
    
    case 'SET_CAMERA_PERMISSION':
      return { ...state, hasCameraPermission: action.payload };
    
    case 'SET_STORAGE_PERMISSION':
      return { ...state, hasStoragePermission: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'RESET_STATE':
      return {
        ...initialState,
        // Preserve permissions
        hasCameraPermission: state.hasCameraPermission,
        hasStoragePermission: state.hasStoragePermission,
      };
    
    default:
      return state;
  }
};

// Provider component
export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Check permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const permissions = await permissionUtils.checkAllPermissions();
        
        dispatch({
          type: 'SET_CAMERA_PERMISSION',
          payload: permissions.camera,
        });
        
        dispatch({
          type: 'SET_STORAGE_PERMISSION',
          payload: permissions.storage,
        });
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    };
    
    checkPermissions();
  }, []);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};
