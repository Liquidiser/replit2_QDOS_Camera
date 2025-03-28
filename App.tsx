import React from 'react';
import { StatusBar, LogBox, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppContext';

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
