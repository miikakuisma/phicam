import React from 'react'
import { Dimensions, StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, AsyncStorage, Slider, Modal, ScrollView, Button } from 'react-native'
import { Camera } from 'expo-camera'
import * as Haptics from 'expo-haptics'
import Carousel from 'react-native-snap-carousel'
import { captureRef as takeSnapshotAsync } from 'react-native-view-shot'
import * as MediaLibrary from 'expo-media-library'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const overlays = [
  {
    image: {
      white: require('./assets/fibbonacci-vertical-white.png'),
      black: require('./assets/fibbonacci-vertical-black.png')
    }
  },
  {
    image: {
      white: require('./assets/spiral-horizontal-white.png'),
      black: require('./assets/spiral-horizontal-black.png')
    }
  },
  {
    image: {
      white: require('./assets/fol-white.png'),
      black: require('./assets/fol-black.png')
    }
  },
  {
    image: {
      white: require('./assets/folstar-white.png'),
      black: require('./assets/folstar-black.png')
    }
  }
]

export default class App extends React.Component {
  state = {
    onboarded: null,
    cameraPermission: null,
    cameraRollPermission: null,
    type: Camera.Constants.Type.back,
    overlay: 0,
    color: 'white',
    zoom: 1,
    lastOverlay: null,
    libraryVisible: false
  }

  async componentDidMount() {
    const { status } = await Camera.requestPermissionsAsync();
    this.setState({
      onboarded: await AsyncStorage.getItem('onboarded'),
      cameraPermission: status === 'granted',
      lastOverlay: parseInt(await AsyncStorage.getItem('overlay')) || 0
    });
  }

  async onboardingDone () {
    this.setState({ onboarded: 'done' })
    try {
      await AsyncStorage.setItem('onboarded', 'done')
    } catch (error) {
      // Error saving data
    }
  }

  async onOverlayChange (index) {
    this.setState({ mode: index })
    try {
      await AsyncStorage.setItem('overlay', index.toString())
    } catch (error) {
      // Error saving data
    } 
  }

  async snap() {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      console.log(photo)
    }
  }

  onFlip() {
    if (this.state.type === Camera.Constants.Type.back) {
      this.setState({
        type: Camera.Constants.Type.front
      })  
    } else {
      this.setState({
        type: Camera.Constants.Type.back
      })  
    }
  }

  async onGrab() {
    if (this.viewport) {
      let screenshot = await takeSnapshotAsync(this.viewport, {
        result: 'tmpfile',
        height: screenWidth,
        width: screenHeight,
        quality: 1,
        format: 'png',
      });
      console.log(screenshot)
    }
  }

  onInvert() {
    const { color } = this.state;
    if (color === 'white') {
      this.setState({ color: 'black' })
    } else {
      this.setState({ color: 'white' })
    }
  }

  onZoom(value) {
    Haptics.selectionAsync()
    this.setState({ zoom: value })
  }

  renderOverlay({item, index}) {
    const { color, zoom } = this.state;
    return <Image
      style={{
        ...styles.overlayImage,
        transform: [{ scale: zoom }]
      }}
      source={item.image[color]}
      resizeMode="contain"
    />
  }

  onToggleLibrary() {
    this.setState({ libraryVisible: !this.state.libraryVisible })
  }

  render() {
    const { cameraPermission, type } = this.state;

    if (cameraPermission === null) {
      return <View />;
    }

    if (cameraPermission === false) {
      return <Text>No access to camera</Text>;
    }

    if (this.state.onboarded !== 'done') {
      return <View style={styles.container}>
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.onboarding}
            onPress={this.onboardingDone.bind(this)}
          >
            <ImageBackground source={require('./assets/onboarding.png')} style={styles.onboardingImg} />
          </TouchableOpacity>
      </View>
    }

    return (
      <View style={styles.container}>
        <View
          ref={ref => { this.viewport = ref; }}
          style={styles.viewport}
        >
          <Camera
            ref={ref => { this.camera = ref; }}
            style={{ flex: 1 }}
            type={type}
          />
          <View style={styles.overlay}>
            <Carousel
              ref={c => this._carousel = c}
              data={overlays}
              renderItem={this.renderOverlay.bind(this)}
              windowSize={1}
              sliderWidth={screenWidth}
              itemWidth={screenWidth}
              inactiveSlideScale={0.8}
              enableSnap={true}
              useScrollView={false}
              contentContainerCustomStyle={styles.swiper}
              loop={true}
              autoplay={false}
              onSnapToItem={(index) => this.onOverlayChange(index)}
              firstItem={this.state.lastOverlay}
            />
          </View>

          <View style={styles.smallButtons}>
            <Slider
              style={{
                width: 150, height: 40, marginLeft: 10, marginRight: 10
              }}
              step={0.05}
              value={this.state.zoom}
              minimumValue={0.5}
              maximumValue={1.5}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#555555"
              onValueChange={this.onZoom.bind(this)}
            />
            <TouchableOpacity onPress={this.onInvert.bind(this)}>
              <Image style={styles.buttonSmall} source={require('./assets/invert.png')} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          <View style={styles.mainButtons}>
            <TouchableOpacity onPress={this.onFlip.bind(this)}>
              <Image style={styles.buttonBig} source={require('./assets/flip.png')} resizeMode="contain" />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onGrab.bind(this)}>
              <Image style={styles.buttonShoot} source={require('./assets/shoot.png')} resizeMode="contain" />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onToggleLibrary.bind(this)}>
              <Image style={styles.buttonBig} source={require('./assets/grid.png')} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>
        { this.state.libraryVisible && <View style={{marginTop: 100}}>
          <Modal
            animationType="slide"
            transparent={true}
            // visible={this.state.libraryVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <ScrollView style={styles.modalContainer}>
              
            </ScrollView>
            <View style={styles.modalBottomButton}>
              <Button title='Close' onPress={this.onToggleLibrary.bind(this)} />
            </View>
          </Modal>
        </View> }
      </View>
    );
  }
}


const styles = StyleSheet.create({
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
    backgroundColor: 'transparent'
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
    maxHeight: screenHeight - 180,
    overflow: "hidden"
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
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight,
    padding: 30,
    backgroundColor: '#ffffff'
  },
  modalBottomButton: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    right: 30,
    zIndex: 3
  }
});
