import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

interface ShareButtonProps {
  onPress: () => void;
  label?: string;
  isLoading?: boolean;
  disabled?: boolean;
  style?: any;
  iconPosition?: 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
  type?: 'primary' | 'secondary' | 'twitter';
}

const ShareButton: React.FC<ShareButtonProps> = ({
  onPress,
  label = 'Share',
  isLoading = false,
  disabled = false,
  style,
  iconPosition = 'left',
  size = 'medium',
  type = 'primary',
}) => {
  // Determine icon based on button type
  const getIcon = () => {
    switch (type) {
      case 'twitter':
        return 'twitter';
      default:
        return 'share-2';
    }
  };

  // Determine button style based on type
  const getButtonStyle = () => {
    switch (type) {
      case 'secondary':
        return styles.buttonSecondary;
      case 'twitter':
        return styles.buttonTwitter;
      default:
        return styles.buttonPrimary;
    }
  };

  // Determine text style based on type
  const getTextStyle = () => {
    switch (type) {
      case 'secondary':
        return styles.textSecondary;
      default:
        return styles.textPrimary;
    }
  };

  // Determine button size
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.buttonSmall;
      case 'large':
        return styles.buttonLarge;
      default:
        return styles.buttonMedium;
    }
  };

  // Render the icon
  const renderIcon = () => {
    const iconColor = type === 'secondary' ? '#2196F3' : '#fff';
    return <Feather name={getIcon()} size={18} color={iconColor} style={styles.icon} />;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getSizeStyle(),
        getButtonStyle(),
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={isLoading || disabled}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <View style={styles.contentContainer}>
          {iconPosition === 'left' && renderIcon()}
          <Text style={[styles.text, getTextStyle()]}>{label}</Text>
          {iconPosition === 'right' && renderIcon()}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonMedium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  buttonPrimary: {
    backgroundColor: '#2196F3',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  buttonTwitter: {
    backgroundColor: '#1DA1F2',
  },
  buttonDisabled: {
    backgroundColor: '#bdbdbd',
    borderColor: '#bdbdbd',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '500',
    fontSize: 16,
  },
  textPrimary: {
    color: '#fff',
  },
  textSecondary: {
    color: '#2196F3',
  },
  icon: {
    marginHorizontal: 6,
  },
});

export default ShareButton;
