import React from 'react';
import { View } from 'react-native';
import Button from '../components/Button'
import { styles } from '../styles/App'

export default function Actions({ visible, onFlip, onGrab, onToggleControls }) {
  if (!visible) {
    return null
  }
  return (
    <View style={styles.mainButtons}>
      <Button icon={require(`../assets/icons/flip.png`)} size='big' onPress={onFlip} />
      <Button icon={require('../assets/icons/shoot.png')} size='primary' onPress={onGrab} />
      <Button icon={require(`../assets/icons/controls.png`)} size='big' onPress={onToggleControls} />
    </View>
  );
}
