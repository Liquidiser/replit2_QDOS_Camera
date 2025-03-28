import React, { useEffect } from 'react';
import { StatusBar, LogBox, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppContext';
import { setApiKey } from './src/api/apiClient';
import { APP_CONFIG } from './src/config';

// API key management
// In a production app, this would be stored in secure storage
// or fetched from environment variables or secure storage
const QDOS_API_KEY = 'DEMO_API_KEY'; // For demo purposes

// Ignore specific warnings (if necessary)
LogBox.ignoreLogs([
  // Rive-related warnings
  'Rive:',
  // Vision Camera related frame processor warnings
  'Frame processors',
  // React Navigation warnings (if any)
  'Non-serializable values'
]);

const App = () => {
  // Initialize API on app startup
  useEffect(() => {
    // Set the API key for the API client
    setApiKey(QDOS_API_KEY);
    
    // In a real app, we would fetch this from secure storage
    // or prompt the user to enter it if not available
    console.log('API initialized with key');
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <AppProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <AppNavigator />
        </NavigationContainer>
      </AppProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
