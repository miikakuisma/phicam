import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../components/Button'

export default function Actions({ visible, onFlip, onGrab, onToggleControls, orientation }) {
  if (!visible) {
    return null
  }
  const styleConfig = orientation === 'PORTRAIT' ? styles.buttonsPortrait : styles.buttonsLandscape
  return (
    <View style={styleConfig}>
      <Button icon={require(`../assets/icons/flip.png`)} size='big' onPress={onFlip} />
      <Button icon={require('../assets/icons/shoot.png')} size='primary' onPress={onGrab} />
      <Button icon={require(`../assets/icons/controls.png`)} size='big' onPress={onToggleControls} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsPortrait: {
    position: 'absolute',
    left: 40,
    right: 40,
    bottom: 70,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  buttonsLandscape: {
    position: 'absolute',
    top: 10,
    right: 70,
    bottom: 10,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
})
