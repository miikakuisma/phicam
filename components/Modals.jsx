import React from 'react';
import { Modal, View, Text, Image } from 'react-native';
import { styles } from '../styles/App'

export default function Modals({ visible }) {
  if (!visible) {
    return null
  }
  return (
    <Modal
      animationType="fade"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalText}>Saved to Your Photos!</Text>
        <Image source={require('../assets/icons/check.png')} style={styles.modalImage} />
      </View>
    </Modal>
  );
}
