import React from 'react'
import { Dimensions, View, ImageBackground, Image, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppLoading from 'expo-app-loading'
import * as ScreenOrientation from 'expo-screen-orientation'
import * as Haptics from 'expo-haptics'
import * as MediaLibrary from 'expo-media-library'
import { Asset } from 'expo-asset'
import { Camera } from 'expo-camera'
import { captureRef as takeSnapshotAsync } from 'react-native-view-shot'
import { assetList } from './assets'
import OverlayBrowser from './components/OverlayBrowser'
import Controls from './components/Controls'
import Actions from './components/Actions'
import Preview from './components/Preview'
import PreviewActions from './components/PreviewActions'
import Modals from './components/Modals'
import { styles } from './styles/App'

export default class App extends React.Component {
  state = {
    // isReady: false,
    onboarded: null,
    orientation: null,
    cameraPermission: null,
    cameraRollPermission: null,
    type: Camera.Constants.Type.back,
    grabbed: false,
    controlsVisible: false,
    zoom: 1,
    color: 'white',
    opacity: 1,
    angle: 0,
    scaleX: 1,
    savedIndex: null,
    screenWidth: null,
    screenHeight: null
  }

  async _cacheResourcesAsync() {
    const images = assetList
    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync()
    }); 
    return Promise.all(cacheImages)
  }

  async askPermissions({ type }) {
    if (type === 'camera') {
      const { status } = await Camera.requestPermissionsAsync()
      return status === 'granted'
    }
    if (type === 'library') {
      const { status } = await MediaLibrary.requestPermissionsAsync()
      return status === 'granted'
    }
  }

  async componentDidMount() {
    const cameraPermission = this.askPermissions({ type: 'camera' })
    const libraryPermission = this.askPermissions({ type: 'library' })
    const onboarded = await AsyncStorage.getItem('onboarded')
    const savedIndex = parseInt(await AsyncStorage.getItem('savedIndex')) || 0
    const getOrientation = await ScreenOrientation.getOrientationAsync()
    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height
    this.setState({
      onboarded,
      cameraPermission,
      libraryPermission,
      savedIndex,
      orientation: getOrientation === 1 ? 'PORTRAIT' : 'LANDSCAPE',
      screenWidth,
      screenHeight
    })
    ScreenOrientation.addOrientationChangeListener(this.orientationChanged.bind(this))
  }

  componentWillUnmount() {
    ScreenOrientation.removeOrientationChangeListeners()
  }

  orientationChanged(event) {
    const { orientation } = event.orientationInfo
    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height
    this.setState({
      orientation: orientation === 1 ? 'PORTRAIT' : 'LANDSCAPE',
      screenWidth,
      screenHeight
    })
  }

  async onboardingDone () {
    this.setState({ onboarded: 'done' })
    try {
      await AsyncStorage.setItem('onboarded', 'done')
    } catch (error) {
      // Error saving data
    }
  }

  onFlip() {
    Haptics.selectionAsync()
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
      Haptics.notificationAsync('success')
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
    Haptics.selectionAsync()
    if (color === 'white') {
      this.setState({ color: 'black' })
    } else {
      this.setState({ color: 'white' })
    }
  }

  onZoom(value) {
    Haptics.selectionAsync()
    this.setState({ zoom: value })
  }

  onRotate() {
    const { angle } = this.state;
    if (angle === -270) {
      this.setState({ angle: 0 })
    } else {
      this.setState({ angle: this.state.angle - 90 })
    }
  }

  onMirror() {
    const { scaleX } = this.state;
    if (scaleX === -1) {
      this.setState({ scaleX: 1 })
    } else {
      this.setState({ scaleX: -1 })
    }
  }

  onChangeOpacity(value) {
    this.setState({ opacity: value })
  }

  onToggleControls() {
    Haptics.selectionAsync()
    this.setState({ controlsVisible: !this.state.controlsVisible })
  }

  onDiscard() {
    this.setState({ grabbed: null })
  }

  async onSave() {
    if (!this.state.cameraRollPermission) {
      this.askPermissions({ type: 'library' })
    }
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
        Haptics.notificationAsync('success')
        this.setState({ savedSuccess: true })
        setTimeout(() => {
          this.setState({ savedSuccess: false })
        }, 1618)
      } catch (error) {
        // Modal for error?
        // Error saving data
      }
    }
  }

  render() {
    const {
      // isReady,
      onboarded,
      orientation,
      cameraPermission,
      type,
      grabbed,
      savedSuccess,
      controlsVisible,
      savedIndex,
      zoom,
      color,
      opacity,
      angle,
      scaleX,
      screenWidth,
      screenHeight
    } = this.state;

    if (cameraPermission === null) {
      return <View style={{ flex: 1, backgroundColor: '#000000' }}></View>;
    }

    if (cameraPermission === false) {
      return <Modal
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>No access to camera</Text>
          <Image source={require('./assets/icons/settings.png')} style={styles.modalImage} />
        </View>
      </Modal>
    }

    // if (!isReady) {
    //   return (
    //     <AppLoading
    //       startAsync={this._cacheResourcesAsync}
    //       onFinish={() => this.setState({ isReady: true })}
    //       onError={console.warn}
    //     />
    //   )
    // }

    if (onboarded !== 'done') {
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
          style={{ flex: 1 }}
          ref={ref => { this.preview = ref; }}
        >
          { !grabbed &&
            <Camera
              ref={ref => { this.camera = ref; }}
              style={{ flex: 1 }}
              type={type}
            />
          }
          <Preview
            visible={grabbed}
            grabbed={grabbed}
            frontCamera={type === Camera.Constants.Type.front}
            screenWidth={screenWidth}
            screenHeight={screenHeight}
          />
          <OverlayBrowser
            savedIndex={savedIndex}
            zoom={zoom}
            color={color}
            angle={angle}
            scaleX={scaleX}
            opacity={opacity}
            screenWidth={screenWidth}
            screenHeight={screenHeight}
          />
          <Controls
            visible={!grabbed && controlsVisible}
            orientation={orientation}
            zoom={zoom}
            opacity={opacity}
            onZoom={this.onZoom.bind(this)}
            onFlip={this.onMirror.bind(this)}
            onRotate={this.onRotate.bind(this)}
            onChangeOpacity={this.onChangeOpacity.bind(this)}
            onInvert={this.onInvert.bind(this)}
          /> 
          <Actions
            visible={!grabbed}
            onFlip={this.onFlip.bind(this)}
            onGrab={this.onGrab.bind(this)}
            onToggleControls={this.onToggleControls.bind(this)}
            orientation={orientation}
          />
        </View>
        <PreviewActions
          visible={grabbed}
          orientation={orientation}
          onDiscard={this.onDiscard.bind(this)}
          onSave={this.onSave.bind(this)}
        />
        <Modals visible={savedSuccess} />
      </View>
    )
  }
}
