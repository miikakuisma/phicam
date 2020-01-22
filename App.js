import React from 'react'
import { Text, View, ImageBackground, Image, TouchableOpacity, AsyncStorage, Slider, Modal, ScrollView, Button } from 'react-native'
import { AppLoading } from 'expo'
import { Asset } from 'expo-asset'
import { Camera } from 'expo-camera'
import * as Haptics from 'expo-haptics'
import * as MediaLibrary from 'expo-media-library'
import Carousel from 'react-native-snap-carousel'
import { captureRef as takeSnapshotAsync } from 'react-native-view-shot'
import { styles, screenWidth, screenHeight } from './styles/App'
import { assetList, overlays } from './overlays'

export default class App extends React.Component {
  state = {
    isReady: false,
    onboarded: null,
    cameraPermission: null,
    cameraRollPermission: null,
    type: Camera.Constants.Type.back,
    overlay: 0,
    color: 'white',
    zoom: 1,
    grabbed: false,
    lastOverlay: null,
    controlsVisible: false,
  }

  async _cacheResourcesAsync() {
    const images = assetList
    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync()
    }); 
    return Promise.all(cacheImages)
  }

  async componentDidMount() {
    const { status } = await Camera.requestPermissionsAsync();
    this.setState({
      onboarded: await AsyncStorage.getItem('onboarded'),
      cameraPermission: status === 'granted',
      lastOverlay: parseInt(await AsyncStorage.getItem('overlay')) || 0,
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
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      this.setState({
        grabbed: {
          uri: photo.uri,
          width: photo.width,
          height: photo.height
        }
      })
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

  onToggleControls() {
    this.setState({ controlsVisible: !this.state.controlsVisible })
  }

  onDiscard() {
    this.setState({ grabbed: null })
  }

  async onSave() {
    if (this.preview) {
      let screenshot = await takeSnapshotAsync(this.preview, {
        result: 'tmpfile',
        quality: 1,
        format: 'png',
      });
      this.setState({
        grabbed: null
      })
      try {
        await MediaLibrary.saveToLibraryAsync(screenshot)
        this.setState({ savedSuccess: true })
        setTimeout(() => {
          this.setState({ savedSuccess: false })
        }, 1618)
      } catch (error) {
        // Error saving data
      }
    }
  }

  render() {
    const { isReady, cameraPermission, type, grabbed, lastOverlay, savedSuccess, controlsVisible, zoom } = this.state;

    if (!isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      ); 
    }

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
        { grabbed && <View style={styles.modalBottomButton}>
          <TouchableOpacity onPress={this.onDiscard.bind(this)}>
            <Image style={styles.buttonHuge} source={require('./assets/icons/delete.png')} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onSave.bind(this)}>
            <Image style={styles.buttonHuge} source={require('./assets/icons/download.png')} resizeMode="contain" />
          </TouchableOpacity>
        </View> }
        <View
          ref={ref => { this.preview = ref; }}
          style={styles.viewport}
        >
          { !grabbed && <Camera
            ref={ref => { this.camera = ref; }}
            style={{ flex: 1 }}
            type={type}
          /> }
          { grabbed && <View style={{ flex: 1 }}>
          <View
            style={{ flex: 1 }}
          >
          <View style={styles.previewContainer}>
            <Image source={grabbed} resizeMode='cover' style={styles.previewContainer} />
          </View>
        </View>
        </View> }
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
              firstItem={lastOverlay}
            />
          </View>

          { !grabbed && controlsVisible && <View style={styles.smallButtons}>
            <Slider
              style={{
                width: 150, height: 40, marginLeft: 10, marginRight: 10
              }}
              step={0.05}
              value={zoom}
              minimumValue={0.5}
              maximumValue={1.5}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#555555"
              onValueChange={this.onZoom.bind(this)}
            />
            <TouchableOpacity onPress={this.onInvert.bind(this)}>
              <Image style={styles.buttonSmall} source={require('./assets/icons/invert.png')} resizeMode="contain" />
            </TouchableOpacity>
          </View> }

          { !grabbed && <View style={styles.mainButtons}>
            <TouchableOpacity onPress={this.onFlip.bind(this)}>
              <Image style={styles.buttonBig} source={require('./assets/icons/flip.png')} resizeMode="contain" />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onGrab.bind(this)}>
              <Image style={styles.buttonShoot} source={require('./assets/icons/shoot.png')} resizeMode="contain" />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onToggleControls.bind(this)}>
              <Image style={styles.buttonBig} source={require('./assets/icons/controls.png')} resizeMode="contain" />
            </TouchableOpacity>
          </View> }
        </View>

        {savedSuccess && <Modal
          animationType="fade"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Saved to Your Photos!</Text>
            <Image source={require('./assets/icons/check.png')} style={styles.modalImage} />
          </View>
        </Modal>}
      </View>
    );
  }
}
