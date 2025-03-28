import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import MediaScreen from '../screens/MediaScreen';
import ShareScreen from '../screens/ShareScreen';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab navigator for main app flow
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Scan') {
            iconName = 'camera';
          } else if (route.name === 'Media') {
            iconName = 'image';
          } else if (route.name === 'Share') {
            iconName = 'share-2';
          }
          
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Media" component={MediaScreen} />
      <Tab.Screen name="Share" component={ShareScreen} />
    </Tab.Navigator>
  );
};

// Main app navigator
const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      
      {/* Modal screens can be added here */}
      <Stack.Screen 
        name="ScanModal" 
        component={ScanScreen} 
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
