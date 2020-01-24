import React from 'react';
import { View, Image, Slider } from 'react-native';
import Button from '../components/Button'
import { styles } from '../styles/App'

export default function Controls({ visible, zoom, onZoom, angle, onRotate, opacity, onChangeOpacity, onInvert }) {
  if (!visible) {
    return null
  }
  return (
    <View style={styles.controlButtons}>
      <View style={{ position: 'absolute', left: 0 }}>
        <Button icon={require(`../assets/icons/invert.png`)} size='small' onPress={onInvert} />
      </View>
      <View style={styles.controlRow}>
        <Image style={styles.controlsIcon} source={require(`../assets/icons/resize.png`)} />
        <Slider
          style={styles.zoomSlider}
          step={0.05}
          value={zoom}
          minimumValue={0.5}
          maximumValue={1.5}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#555555"
          onValueChange={onZoom}
        />
      </View>
      <View style={styles.controlRow}>
        <Image style={styles.controlsIcon} source={require(`../assets/icons/opacity.png`)} />
        <Slider
          style={styles.opacitySlider}
          step={0.05}
          value={opacity}
          minimumValue={0.1}
          maximumValue={1}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#555555"
          onValueChange={onChangeOpacity}
        />
      </View>
      <View style={{ position: 'absolute', right: 0 }}>
        <Button icon={require(`../assets/icons/rotate.png`)} size='small' onPress={onRotate} />
      </View>
    </View>
  );
}
