import React from 'react';
import { View } from 'react-native';
import Button from '../components/Button'
import { styles } from '../styles/App'

export default function PreviewActions({ visible, onDiscard, onSave }) {
  if (!visible) {
    return null
  }
  return (
    <View style={styles.modalBottomButton}>
      <Button icon={require(`../assets/icons/delete.png`)} size='huge' onPress={onDiscard} />
      <Button icon={require(`../assets/icons/download.png`)} size='huge' onPress={onSave} />
    </View>
  );
}
