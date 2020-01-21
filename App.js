import React from 'react'
import { Dimensions, StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, AsyncStorage, Slider, Modal, ScrollView, Button } from 'react-native'
import { Camera } from 'expo-camera'
import * as Haptics from 'expo-haptics'
import Carousel from 'react-native-snap-carousel'
import { captureRef as takeSnapshotAsync } from 'react-native-view-shot'
import * as MediaLibrary from 'expo-media-library'
import { styles, screenWidth, screenHeight } from './styles/App'
import { overlays } from './overlays'

export default class App extends React.Component {
  state = {
    onboarded: null,
    cameraPermission: null,
    cameraRollPermission: null,
    type: Camera.Constants.Type.back,
    overlay: 0,
    color: 'white',
    zoom: 1,
    grabbed: false,
    lastOverlay: null,
    libraryVisible: false,
    library: []
  }

  async componentDidMount() {
    const { status } = await Camera.requestPermissionsAsync();
    this.setState({
      onboarded: await AsyncStorage.getItem('onboarded'),
      cameraPermission: status === 'granted',
      lastOverlay: parseInt(await AsyncStorage.getItem('overlay')) || 0,
      library: JSON.parse(await AsyncStorage.getItem('library')) || [],
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
      console.log(photo)
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

  onToggleLibrary() {
    this.setState({ libraryVisible: !this.state.libraryVisible })
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
      const library = this.state.library
      library.push(screenshot)
      this.setState({
        library,
        grabbed: null
      })
      try {
        await AsyncStorage.setItem('library', JSON.stringify(library))
      } catch (error) {
        // Error saving data
      }
    }
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

    const photos = this.state.library.reverse().map((photo, index) => <Image
      key={index}
      style={{
        width: screenWidth / 4,
        height: screenHeight / 4,
        margin: 10
      }}
      resizeMethod="auto"
      source={{ uri: photo }}
    />)

    return (
      <View style={styles.container}>
        <View
          ref={ref => { this.preview = ref; }}
          style={styles.viewport}
        >
          { !this.state.grabbed && <Camera
            ref={ref => { this.camera = ref; }}
            style={{ flex: 1 }}
            type={type}
          /> }
          { this.state.grabbed && <View style={{ flex: 1 }}>
          <View
            style={{ flex: 1 }}
          >
          <View style={styles.previewContainer}>
            <Image source={this.state.grabbed} resizeMode='cover' style={styles.previewContainer} />
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
              firstItem={this.state.lastOverlay}
            />
          </View>

          { !this.state.grabbed && <View style={styles.smallButtons}>
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
          </View> }

          { !this.state.grabbed && <View style={styles.mainButtons}>
            <TouchableOpacity onPress={this.onFlip.bind(this)}>
              <Image style={styles.buttonBig} source={require('./assets/flip.png')} resizeMode="contain" />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onGrab.bind(this)}>
              <Image style={styles.buttonShoot} source={require('./assets/shoot.png')} resizeMode="contain" />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onToggleLibrary.bind(this)}>
              <Image style={styles.buttonBig} source={require('./assets/grid.png')} resizeMode="contain" />
            </TouchableOpacity>
          </View> }
          { this.state.grabbed && <View style={styles.modalBottomButton}>
            <Button title='Discard' onPress={this.onDiscard.bind(this)} />
            <Button title='Save' onPress={this.onSave.bind(this)} />
          </View> }
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
              {photos}
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
