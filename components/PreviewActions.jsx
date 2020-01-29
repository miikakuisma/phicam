import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../components/Button'

export default function PreviewActions({ visible, orientation, onDiscard, onSave }) {
  if (!visible) {
    return null
  }
  return (
    <View style={orientation === 'PORTRAIT' ? styles.buttonsPortrait : styles.buttonsLandscape }>
      <Button icon={require(`../assets/icons/delete.png`)} size='huge' onPress={onDiscard} />
      <Button icon={require(`../assets/icons/download.png`)} size='huge' onPress={onSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsPortrait: {
    position: 'absolute',
    bottom: 70,
    left: 30,
    right: 30,
    zIndex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  buttonsLandscape: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    zIndex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
})
