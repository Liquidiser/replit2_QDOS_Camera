import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Linking,
  Alert,
  ScrollView,
  ActivityIndicator,
  Share as RNShare,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { qrService } from '../api/qrService';
import { twitterService } from '../api/twitterService';
import ShareButton from '../components/ShareButton';
import ErrorDisplay from '../components/ErrorDisplay';
import { QRCodeDetails } from '../types';

interface ShareScreenParams {
  qrId?: string;
  mediaUrl?: string;
}

const ShareScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as ShareScreenParams || {};
  
  // State
  const [qrDetails, setQRDetails] = useState<QRCodeDetails | null>(null);
  const [twitterLink, setTwitterLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load QR details and Twitter link on mount
  useEffect(() => {
    if (params.qrId) {
      loadQRDetailsAndTwitterLink(params.qrId);
    }
  }, [params.qrId]);
  
  // Load QR details and generate Twitter link
  const loadQRDetailsAndTwitterLink = async (qrId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch QR details
      const details = await qrService.getQRDetails(qrId);
      setQRDetails(details);
      
      // Generate Twitter link
      const link = await twitterService.generateTwitterLink(qrId);
      setTwitterLink(link);
    } catch (err) {
      setError('Failed to load sharing information');
      console.error('Error loading share data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Share to Twitter
  const handleTwitterShare = async () => {
    if (!twitterLink) {
      setError('Twitter link not available');
      return;
    }
    
    try {
      const success = await twitterService.openTwitterShare(twitterLink);
      
      if (!success) {
        // Fallback to custom share if Twitter app/web doesn't open
        Alert.alert(
          'Twitter Not Available',
          'Would you like to copy the link to clipboard instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Copy Link', 
              onPress: async () => {
                await Clipboard.setString(twitterLink);
                Alert.alert('Success', 'Link copied to clipboard');
              }
            }
          ]
        );
      }
    } catch (err) {
      setError('Failed to share to Twitter');
    }
  };
  
  // Share using native share dialog
  const handleNativeShare = async () => {
    if (!qrDetails) {
      setError('No content available to share');
      return;
    }
    
    try {
      const shareOptions = {
        title: qrDetails.subject,
        message: `${qrDetails.subject}\n${qrDetails.context}\n\n${qrDetails.narrative}`,
        url: params.mediaUrl || twitterLink || undefined,
      };
      
      await RNShare.share(shareOptions);
    } catch (err) {
      setError('Failed to open share dialog');
    }
  };
  
  // Create a custom Twitter share with text
  const handleCustomTwitterShare = async () => {
    if (!qrDetails) {
      setError('No content available to share');
      return;
    }
    
    try {
      // Create short text for tweet (Twitter character limit)
      const shortText = `${qrDetails.subject}: ${qrDetails.context.substring(0, 100)}${qrDetails.context.length > 100 ? '...' : ''}`;
      
      // Use the service's custom share method
      const success = await twitterService.shareToTwitter(shortText);
      
      if (!success) {
        setError('Failed to open Twitter');
      }
    } catch (err) {
      setError('Failed to share to Twitter');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Share</Text>
      </View>
      
      {/* Error display */}
      {error && (
        <ErrorDisplay 
          message={error} 
          onDismiss={() => setError(null)} 
        />
      )}
      
      {/* Loading state */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading share options...</Text>
        </View>
      ) : (
        <ScrollView style={styles.contentContainer}>
          {/* QR Info section */}
          {qrDetails && (
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>{qrDetails.subject}</Text>
              <Text style={styles.infoContext}>{qrDetails.context}</Text>
              <Text style={styles.infoNarrative}>{qrDetails.narrative}</Text>
            </View>
          )}
          
          {/* Share options section */}
          <View style={styles.shareOptionsContainer}>
            <Text style={styles.sectionTitle}>Share Options</Text>
            
            {/* Twitter share button */}
            <ShareButton
              label="Share on Twitter"
              onPress={handleTwitterShare}
              type="twitter"
              icon="twitter"
              disabled={!twitterLink}
              style={styles.shareButton}
            />
            
            {/* Custom Twitter share button */}
            <ShareButton
              label="Custom Twitter Share"
              onPress={handleCustomTwitterShare}
              type="twitter"
              icon="twitter"
              disabled={!qrDetails}
              style={styles.shareButton}
            />
            
            {/* Native share button */}
            <ShareButton
              label="Share via..."
              onPress={handleNativeShare}
              icon="share-2"
              disabled={!qrDetails}
              style={styles.shareButton}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoContext: {
    fontSize: 16,
    marginBottom: 12,
    color: '#555',
  },
  infoNarrative: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  shareOptionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  shareButton: {
    marginBottom: 12,
  },
});

export default ShareScreen;
