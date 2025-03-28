import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle, Platform } from 'react-native';
import { Rive, RiveRef, useRive } from 'rive-react-native';

interface RiveAnimationProps {
  url: string;
  style?: StyleProp<ViewStyle>;
  orientation?: 'portrait' | 'landscape';
  fit?: 'cover' | 'contain' | 'fill' | 'fitWidth' | 'fitHeight';
  autoplay?: boolean;
}

const RiveAnimation: React.FC<RiveAnimationProps> = ({
  url,
  style,
  orientation = 'portrait',
  fit = 'cover',
  autoplay = true
}) => {
  const riveRef = useRef<RiveRef>(null);
  
  // Setup Rive animation
  const { RiveAnimation, isLoading, error } = useRive({ 
    url, 
    autoplay,
    fit
  });
  
  // Handle orientation changes
  useEffect(() => {
    // Some Rive animations may have state machines or inputs
    // that could be controlled based on orientation
    if (riveRef.current) {
      // Example: If the Rive animation has a state machine with an input for orientation
      try {
        const stateMachine = 'Main'; // Default state machine name, may need adjustment per animation
        const input = 'isLandscape'; // Hypothetical input name for orientation
        const isLandscape = orientation === 'landscape';
        
        riveRef.current.setInputValue(stateMachine, input, isLandscape);
      } catch (e) {
        // Input might not exist, which is fine
      }
    }
  }, [orientation]);

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loadingPlaceholder} />
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          {/* We avoid showing mock error content as per guidelines */}
        </View>
      </View>
    );
  }

  // Calculate fit mode based on orientation
  const determineFit = () => {
    // For landscape orientation, we might want different fit behavior
    // than for portrait orientation
    if (orientation === 'landscape') {
      return 'cover';
    }
    return fit;
  };

  return (
    <View style={[styles.container, style]}>
      <Rive
        ref={riveRef}
        alignment="center"
        fit={determineFit()}
        style={styles.animation}
        resourceName={undefined} // Only using URL-based animations
        url={url}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  animation: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.05)',
  },
});

export default RiveAnimation;
