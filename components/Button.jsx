import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function Button({ icon, size, onPress }) {
  const getStylesBySize = () => {
    switch (size) {
      case 'primary':
        return styles.primary
      case 'small':
        return styles.small
      case 'big':
        return styles.big
      case 'huge':
        return styles.huge
    }
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        style={getStylesBySize()}
        source={icon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

styles = StyleSheet.create({
  primary: {
    width: 84,
    height: 84,
    backgroundColor: 'black',
    borderRadius: 24,
    marginTop: -10
  },
  small: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 2
  },
  big: {
    width: 64,
    height: 64,
    backgroundColor: 'white',
    borderRadius: 16
  },
  huge: {
    width: 84,
    height: 84,
    backgroundColor: 'white',
    borderRadius: 24
  }
})
