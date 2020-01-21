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
  smallButtons: {
    position: 'absolute',
    left: 40,
    right: 40,
    bottom: 180,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  buttonSmall: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 16
  },
  mainButtons: {
    position: 'absolute',
    left: 40,
    right: 40,
    bottom: 70,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  buttonBig: {
    width: 64,
    height: 64,
    backgroundColor: 'white',
    borderRadius: 16
  },
  buttonShoot: {
    width: 84,
    height: 84,
    backgroundColor: 'black',
    borderRadius: 24,
    marginTop: -10
  },
  buttonHuge: {
    width: 84,
    height: 84,
    backgroundColor: 'white',
    borderRadius: 24
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
    height: screenHeight,
    padding: 30,
    backgroundColor: '#ffffff',
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