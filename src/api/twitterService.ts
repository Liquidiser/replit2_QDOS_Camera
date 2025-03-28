import { api } from './apiClient';
import { TwitterLinkResponse } from '../types';
import { Linking } from 'react-native';

/**
 * Twitter Service - Handles Twitter sharing functionality
 */
export const twitterService = {
  /**
   * Generate a Twitter share link for a QR code
   * @param qrId - The QR code ID
   * @returns Twitter share link
   */
  generateTwitterLink: async (qrId: string): Promise<string> => {
    try {
      const response = await api.get<TwitterLinkResponse>('/twitter/generate-link', {
        reference_id: qrId
      });
      return response.twitter_link;
    } catch (error) {
      console.error('Error generating Twitter link:', error);
      throw error;
    }
  },

  /**
   * Open Twitter app or browser with the share link
   * @param twitterLink - Twitter share link
   * @returns Whether the link was opened successfully
   */
  openTwitterShare: async (twitterLink: string): Promise<boolean> => {
    try {
      const canOpen = await Linking.canOpenURL(twitterLink);
      
      if (canOpen) {
        await Linking.openURL(twitterLink);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error opening Twitter share:', error);
      return false;
    }
  },

  /**
   * Create and open a custom Twitter share
   * @param text - Text content to share
   * @param url - URL to include in the tweet
   * @returns Whether the share was opened successfully
   */
  shareToTwitter: async (text: string, url?: string): Promise<boolean> => {
    try {
      let tweetText = encodeURIComponent(text);
      
      if (url) {
        tweetText += `%20${encodeURIComponent(url)}`;
      }
      
      const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
      return await twitterService.openTwitterShare(twitterUrl);
    } catch (error) {
      console.error('Error sharing to Twitter:', error);
      return false;
    }
  }
};
