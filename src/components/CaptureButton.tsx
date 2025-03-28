import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StyleProp,
  ViewStyle,
  Pressable,
  Animated,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEffect, useRef } from 'react';

interface CaptureButtonProps {
  onPress?: () => void;
  onLongPress?: () => void;
  isRecording?: boolean;
  isActive?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
  icon?: string;
  label?: string;
}

const CaptureButton: React.FC<CaptureButtonProps> = ({
  onPress,
  onLongPress,
  isRecording = false,
  isActive = false,
  size = 60,
  style,
  icon,
  label,
}) => {
  const [pressed, setPressed] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Create pulsing animation for recording state
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
    
    return () => {
      pulseAnim.setValue(1);
    };
  }, [isRecording, pulseAnim]);
  
  // Determine button appearance based on type
  const renderButton = () => {
    // Icon-based button
    if (icon) {
      return (
        <TouchableOpacity
          style={[
            styles.iconButton,
            isActive && styles.activeIconButton,
            style,
          ]}
          onPress={onPress}
        >
          {icon.includes('outline') ? (
            <Ionicons 
              name={icon} 
              size={24} 
              color={isActive ? '#fff' : '#ddd'} 
            />
          ) : (
            <Feather 
              name={icon} 
              size={24} 
              color={isActive ? '#fff' : '#ddd'} 
            />
          )}
        </TouchableOpacity>
      );
    }

    // Text-based button
    if (label) {
      return (
        <TouchableOpacity
          style={[styles.labelButton, style]}
          onPress={onPress}
        >
          <Text style={styles.labelText}>{label}</Text>
        </TouchableOpacity>
      );
    }

    // Main capture button (photo/video)
    const buttonSize = {
      width: size,
      height: size,
      borderRadius: size / 2,
    };
    
    const innerSize = {
      width: size * 0.8,
      height: size * 0.8,
      borderRadius: (size * 0.8) / 2,
    };
    
    const recordingSize = {
      width: size * 0.4,
      height: size * 0.4,
      borderRadius: 6,
    };
    
    return (
      <Pressable
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={300}
        style={({ pressed }) => [
          styles.captureButton,
          buttonSize,
          pressed && styles.captureButtonPressed,
          style,
        ]}
      >
        <Animated.View
          style={[
            styles.captureButtonInner,
            innerSize,
            isRecording && recordingSize,
            isRecording && styles.recording,
            {
              transform: [{ scale: isRecording ? pulseAnim : 1 }],
            },
          ]}
        />
      </Pressable>
    );
  };

  return renderButton();
};

const styles = StyleSheet.create({
  captureButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  captureButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  captureButtonInner: {
    backgroundColor: '#fff',
  },
  recording: {
    backgroundColor: 'red',
  },
  iconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  labelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CaptureButton;
