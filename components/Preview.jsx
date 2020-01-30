import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

export default function Preview({ visible, grabbed, frontCamera, screenWidth, screenHeight }) {
  if (!visible) {
    return null
  }
  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#000000',
      maxWidth: screenWidth,
      maxHeight: screenHeight
    }}>
      <Image source={grabbed} resizeMode='cover' style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000000',
        maxWidth: screenWidth,
        maxHeight: screenHeight,
        transform: [
          { scaleX: frontCamera ? -1 : 1 }
        ]
      }} />
      <Image source={require(`../assets/logo.png`)} resizeMode='cover' style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 48,
    height: 48,
    marginTop: 40,
    marginLeft: 25,
    opacity: 0.3,
    zIndex: 9
  }
})
