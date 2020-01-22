import React from 'react';
import { View, Slider } from 'react-native';
import Button from '../components/Button'
import { styles } from '../styles/App'

export default function Controls({ visible, zoom, onZoom, onInvert }) {
  if (!visible) {
    return null
  }
  return (
    <View style={styles.smallButtons}>
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
      <Button icon={require(`../assets/icons/invert.png`)} size='small' onPress={onInvert} />
    </View>
  );
}
