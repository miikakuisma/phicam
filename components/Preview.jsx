import React from 'react';
import { View, Image } from 'react-native';
import { styles } from '../styles/App'

export default function Preview({ visible, grabbed }) {
  if (!visible) {
    return null
  }
  return (
    <View style={styles.previewContainer}>
      <Image source={grabbed} resizeMode='cover' style={styles.previewContainer} />
      <Image source={require(`../assets/logo.png`)} resizeMode='cover' style={{ zIndex: 9, width: 48, height: 48, marginTop: 70, alignSelf: 'center' }} />
    </View>
  );
}
