import { Dimensions, StyleSheet } from 'react-native'

export const screenWidth = Dimensions.get('window').width
export const screenHeight = Dimensions.get('window').height

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  onboarding: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1
  },
  onboardingImg: {
    flex: 1,
  },
  viewport: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  swiper: {

  },
  overlayImage: {
    alignSelf: "center",
    maxWidth: screenWidth - 40,
    maxHeight: screenHeight - 40,
  },
  zoomSlider: {
    width: 100,
    height: 40,
    marginLeft: 10,
    marginRight: 10
  },
  opacitySlider: {
    width: 100,
    height: 40,
    marginLeft: 10,
    marginRight: 10
  },
  controlButtons: {
    position: 'absolute',
    left: 40,
    right: 40,
    bottom: 180,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  controlsIcon: {
    width: 24,
    height: 24
  },
  mainButtons: {
    position: 'absolute',
    left: 40,
    right: 40,
    bottom: 70,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  previewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#000000',
  },
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
});