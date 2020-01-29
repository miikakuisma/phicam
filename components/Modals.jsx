import React from 'react';
import { StyleSheet, Dimensions, Modal, View, Text, Image } from 'react-native';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

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

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalText: {
    fontSize: 24,
    width: screenWidth / 3,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalImage: {
    width: 128,
    height: 128
  },
  modalBottomButton: {
    position: 'absolute',
    bottom: 70,
    left: 30,
    right: 30,
    zIndex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
})
