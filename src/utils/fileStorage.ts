import RNFS from 'react-native-fs';
import { MediaFile } from '../types';

/**
 * File storage utilities - Handle file operations
 */
export const fileStorage = {
  /**
   * Get app's base directory for storing media
   * @returns Directory path
   */
  getBaseDirectory: (): string => {
    return `${RNFS.DocumentDirectoryPath}/qrscanner`;
  },

  /**
   * Create directory if it doesn't exist
   * @param dirPath - Directory path
   */
  createDirectoryIfNeeded: async (dirPath?: string): Promise<void> => {
    const targetDir = dirPath || fileStorage.getBaseDirectory();
    const exists = await RNFS.exists(targetDir);
    
    if (!exists) {
      await RNFS.mkdir(targetDir);
    }
  },

  /**
   * Get all saved media files
   * @returns Array of media files
   */
  getAllMedia: async (): Promise<MediaFile[]> => {
    try {
      const baseDir = fileStorage.getBaseDirectory();
      await fileStorage.createDirectoryIfNeeded(baseDir);
      
      const files = await RNFS.readDir(baseDir);
      
      return files.map(file => ({
        uri: file.path,
        name: file.name,
        type: file.name.endsWith('.mp4') ? 'video' : 'photo',
        size: file.size
      }));
    } catch (error) {
      console.error('Error reading media files:', error);
      return [];
    }
  },

  /**
   * Save media file to storage
   * @param sourceUri - Source URI of the file
   * @param type - Media type (photo or video)
   * @returns Saved media file
   */
  saveMedia: async (sourceUri: string, type: 'photo' | 'video'): Promise<MediaFile> => {
    try {
      const baseDir = fileStorage.getBaseDirectory();
      await fileStorage.createDirectoryIfNeeded(baseDir);
      
      const timestamp = new Date().getTime();
      const extension = type === 'photo' ? 'jpg' : 'mp4';
      const fileName = `${timestamp}.${extension}`;
      const targetPath = `${baseDir}/${fileName}`;
      
      await RNFS.copyFile(sourceUri, targetPath);
      
      const fileStats = await RNFS.stat(targetPath);
      
      return {
        uri: targetPath,
        name: fileName,
        type,
        size: fileStats.size
      };
    } catch (error) {
      console.error('Error saving media:', error);
      throw error;
    }
  },

  /**
   * Delete a media file
   * @param uri - URI of the file to delete
   */
  deleteMedia: async (uri: string): Promise<void> => {
    try {
      if (await RNFS.exists(uri)) {
        await RNFS.unlink(uri);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  /**
   * Clear all stored media
   */
  clearAllMedia: async (): Promise<void> => {
    try {
      const baseDir = fileStorage.getBaseDirectory();
      if (await RNFS.exists(baseDir)) {
        await RNFS.unlink(baseDir);
        await fileStorage.createDirectoryIfNeeded(baseDir);
      }
    } catch (error) {
      console.error('Error clearing media:', error);
      throw error;
    }
  }
};
