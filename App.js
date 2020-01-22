import React from 'react'
import { Text, View, ImageBackground, Image, TouchableOpacity, AsyncStorage, Slider, Modal, ScrollView } from 'react-native'
import { AppLoading } from 'expo'
import { Asset } from 'expo-asset'
import { Camera } from 'expo-camera'
import * as Haptics from 'expo-haptics'
import * as MediaLibrary from 'expo-media-library'
import OverlayBrowser from './components/OverlayBrowser'
import { captureRef as takeSnapshotAsync } from 'react-native-view-shot'
import { styles } from './styles/App'
import { assetList } from './assets'
import Button from './components/Button'

export default class App extends React.Component {
  state = {
    isReady: false,
    onboarded: null,
    cameraPermission: null,
    cameraRollPermission: null,
    bootDelay: false,
    type: Camera.Constants.Type.back,
    grabbed: false,
    controlsVisible: false,
    zoom: 1,
    color: 'white',
    savedIndex: null
  }

  async _cacheResourcesAsync() {
    const images = assetList
    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync()
    }); 
    return Promise.all(cacheImages)
  }

  async componentDidMount() {
    const { status } = await Camera.requestPermissionsAsync()
    this.setState({
      onboarded: await AsyncStorage.getItem('onboarded'),
      cameraPermission: status === 'granted',
      savedIndex: parseInt(await AsyncStorage.getItem('savedIndex')) || 0
    })
    setTimeout(() => {
      this.setState({ bootDelay: true })
    }, 1000)
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

  onToggleControls() {
    Haptics.selectionAsync()
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
      isReady,
      cameraPermission,
      bootDelay,
      type,
      grabbed,
      savedSuccess,
      controlsVisible,
      savedIndex,
      zoom,
      color
    } = this.state;

    if (!isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      )
    }

    if (!cameraPermission && isReady && bootDelay) {
      return <Modal
      animationType="fade"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalText}>No access to camera</Text>
        <Image source={require('./assets/icons/settings.png')} style={styles.modalImage} />
      </View>
    </Modal>}

    if (this.state.onboarded !== 'done' && bootDelay) {
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
          style={styles.viewport}
          ref={ref => { this.preview = ref; }}
        >
          { !grabbed && <Camera
            ref={ref => { this.camera = ref; }}
            style={{ flex: 1 }}
            type={type}
          /> }
          { grabbed && <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={styles.previewContainer}>
                <Image source={grabbed} resizeMode='cover' style={styles.previewContainer} />
              </View>
            </View>
          </View> }

          <OverlayBrowser savedIndex={savedIndex} zoom={zoom} color={color} />

          { !grabbed && controlsVisible && <View style={styles.smallButtons}>
            <Slider
              style={styles.zoomSlider}
              step={0.05}
              value={zoom}
              minimumValue={0.5}
              maximumValue={1.5}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#555555"
              onValueChange={this.onZoom.bind(this)}
            />
            <Button icon={require(`./assets/icons/invert.png`)} size='small' onPress={this.onInvert.bind(this)} />
          </View> }

          { !grabbed && <View style={styles.mainButtons}>
            <Button icon={require(`./assets/icons/flip.png`)} size='big' onPress={this.onFlip.bind(this)} />
            <Button icon={require('./assets/icons/shoot.png')} size='primary' onPress={this.onGrab.bind(this)} />
            <Button icon={require(`./assets/icons/controls.png`)} size='big' onPress={this.onToggleControls.bind(this)} />
          </View> }
        </View>

        { grabbed && <View style={styles.modalBottomButton}>
          <Button icon={require(`./assets/icons/delete.png`)} size='huge' onPress={this.onDiscard.bind(this)} />
          <Button icon={require(`./assets/icons/download.png`)} size='huge' onPress={this.onSave.bind(this)} />
        </View> }

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
    )
  }
}
