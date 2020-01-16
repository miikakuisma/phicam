import React from 'react';
import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { captureRef as takeSnapshotAsync } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

export default class App extends React.Component {
  state = {
    cameraPermission: null,
    cameraRollPermission: null,
    type: Camera.Constants.Type.back
  }

  async componentDidMount() {
    const { status } = await Camera.requestPermissionsAsync();
    this.setState({ cameraPermission: status === 'granted' });
  }

  render() {
    const { cameraPermission, type } = this.state;

    if (cameraPermission === null) {
      return <View />;
    }

    if (cameraPermission === false) {
      return <Text>No access to camera</Text>;
    }

    const snap = async () => {
      if (this.camera) {
        let photo = await this.camera.takePictureAsync();
        console.log(photo)
      }
    };

    const grab = async () => {
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

    return (
      <View style={{ flex: 1 }}>
        <View
          ref={ref => {
            this.viewport = ref;
          }}
          style={{ flex: 1, backgroundColor: 'transparent' }}
        >
          <Camera
            ref={ref => {
              this.camera = ref;
            }}
            style={{ flex: 1 }}
            type={type}
          />
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.overlay}
              onPress={grab}
            >
              <Image
                source={require('./assets/fol.png')}
                style={styles.overlayImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  overlayImage: {
    marginTop: (screenHeight - screenWidth) / 2,
    width: screenWidth,
    height: screenWidth,
  }
});
