import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QR Scanner App</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Main feature cards */}
        <View style={styles.featuresContainer}>
          {/* QR Scanner Card */}
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => navigation.navigate('Scan')}
          >
            <View style={styles.featureIconContainer}>
              <Feather name="maximize" size={32} color="#2196F3" />
            </View>
            <Text style={styles.featureTitle}>Scan QR Code</Text>
            <Text style={styles.featureDescription}>
              Scan QR codes to view detailed information with animated overlays
            </Text>
          </TouchableOpacity>
          
          {/* Media Gallery Card */}
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => navigation.navigate('Media')}
          >
            <View style={styles.featureIconContainer}>
              <Feather name="image" size={32} color="#4CAF50" />
            </View>
            <Text style={styles.featureTitle}>Media Gallery</Text>
            <Text style={styles.featureDescription}>
              View and manage your captured media files
            </Text>
          </TouchableOpacity>
          
          {/* Share on Twitter Card */}
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => navigation.navigate('Share')}
          >
            <View style={styles.featureIconContainer}>
              <Feather name="twitter" size={32} color="#1DA1F2" />
            </View>
            <Text style={styles.featureTitle}>Share on Twitter</Text>
            <Text style={styles.featureDescription}>
              Share your scanned QR code information on Twitter
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Instructions section */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>How to use</Text>
          
          <View style={styles.instructionStep}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Scan a QR Code</Text>
              <Text style={styles.stepDescription}>
                Open the QR scanner and position the code within the viewfinder
              </Text>
            </View>
          </View>
          
          <View style={styles.instructionStep}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>View Animation Overlay</Text>
              <Text style={styles.stepDescription}>
                After scanning, the app will display a Rive animation overlay
              </Text>
            </View>
          </View>
          
          <View style={styles.instructionStep}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Capture Media</Text>
              <Text style={styles.stepDescription}>
                Take photos or record videos related to the scanned QR code
              </Text>
            </View>
          </View>
          
          <View style={styles.instructionStep}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Share on Twitter</Text>
              <Text style={styles.stepDescription}>
                Share your scanned QR information on Twitter with a single tap
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom action button - Quick scan */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Scan')}
      >
        <Feather name="camera" size={24} color="#fff" />
        <Text style={styles.floatingButtonText}>Quick Scan</Text>
      </TouchableOpacity>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  featuresContainer: {
    padding: 16,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  instructionsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2196F3',
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default HomeScreen;
