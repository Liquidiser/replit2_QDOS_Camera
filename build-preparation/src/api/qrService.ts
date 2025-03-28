import { api } from './apiClient';
import { ApiResponse, QRCodeDetails, QRCodeCreateRequest } from '../types';

/**
 * QR Service - Handles all QR code related API calls
 */
export const qrService = {
  /**
   * Fetch QR code details by ID
   * @param qrId - The QR code ID
   * @returns QR code details
   */
  getQRDetails: async (qrId: string): Promise<QRCodeDetails> => {
    try {
      // Based on API specification, the endpoint should be '/qr/{id}'
      const response = await api.get<ApiResponse<QRCodeDetails>>(`/qr/${qrId}`);
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error('Failed to fetch QR details');
    } catch (error) {
      console.error('Error fetching QR details:', error);
      throw error;
    }
  },

  /**
   * Create a new QR code post
   * @param qrData - QR code data to submit
   * @returns Success message
   */
  createQRPost: async (qrData: QRCodeCreateRequest): Promise<string> => {
    try {
      // Based on API specification, the endpoint should be '/qr'
      const response = await api.post<ApiResponse<void>>('/qr', qrData);
      if (response.status === 'success' && response.message) {
        return response.message;
      }
      throw new Error('Failed to create QR post');
    } catch (error) {
      console.error('Error creating QR post:', error);
      throw error;
    }
  },

  /**
   * Delete a QR code by ID
   * @param qrId - The QR code ID
   * @returns Success message
   */
  deleteQR: async (qrId: string): Promise<string> => {
    try {
      const response = await api.delete<ApiResponse<void>>(`/qr/${qrId}`);
      if (response.status === 'success' && response.message) {
        return response.message;
      }
      throw new Error('Failed to delete QR code');
    } catch (error) {
      console.error('Error deleting QR code:', error);
      throw error;
    }
  }
};
