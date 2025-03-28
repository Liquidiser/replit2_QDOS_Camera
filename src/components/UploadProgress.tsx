import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

interface UploadProgressProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  size = 100,
  strokeWidth = 10,
  color = '#2196F3',
  backgroundColor = '#e0e0e0',
  showPercentage = true,
}) => {
  // Animation value
  const animatedProgress = useRef(new Animated.Value(0)).current;
  
  // Update animation when progress changes
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedProgress]);
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Convert progress (0-1) to stroke dash offset
  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });
  
  // Format progress as percentage
  const progressPercentage = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });
  
  return (
    <View style={styles.container}>
      <View style={[styles.progressContainer, { width: size, height: size }]}>
        {/* Background circle */}
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={backgroundColor}
            fill="transparent"
          />
        </Svg>
        
        {/* Progress circle (animated) */}
        <Svg
          width={size}
          height={size}
          style={StyleSheet.absoluteFill}
        >
          <Animated.Component
            component={Circle}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={color}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        
        {/* Percentage text */}
        {showPercentage && (
          <View style={styles.textContainer}>
            <Animated.Text style={styles.progressText}>
              {progressPercentage.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              })}
            </Animated.Text>
          </View>
        )}
      </View>
      
      {/* Status text */}
      <Text style={styles.statusText}>
        {progress === 1 ? 'Upload complete' : 'Uploading...'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  statusText: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
});

export default UploadProgress;
