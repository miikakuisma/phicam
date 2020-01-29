import React from 'react';
import { StyleSheet, View, Image, Slider } from 'react-native';
import Button from '../components/Button'

export default function Controls({ visible, zoom, onZoom, onRotate, opacity, onChangeOpacity, onInvert, onFlip, orientation }) {
  if (!visible) {
    return null
  }
  const styleConfig = orientation === 'PORTRAIT' ? styles.buttonsPortrait : styles.buttonsLandscape
  return (
    <View style={styleConfig}>
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
        <Button icon={require(`../assets/icons/mirror.png`)} size='small' onPress={onFlip} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsPortrait: {
    position: 'absolute',
    left: 40,
    right: 40,
    bottom: 180,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonsLandscape: {
    position: 'absolute',
    left: 40,
    width: 250,
    bottom: 150,
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
  }
})
