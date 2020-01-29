import React from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, View, Image, AsyncStorage } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { overlays } from '../assets'

const propTypes = {
  zoom: PropTypes.number,
  savedIndex: PropTypes.number,
  color: PropTypes.string,
  opacity: PropTypes.number,
  angle: PropTypes.number,
  screenWidth: PropTypes.number,
  screenHeight: PropTypes.number
};

const defaultProps = {
  zoom: 1,
  color: 'white'
};

class OverlayBrowser extends React.Component {
  renderOverlay({item, index}) {
    const { zoom, color, opacity, angle, screenWidth, screenHeight } = this.props
    return <Image
      style={{
        alignSelf: 'center',
        justifyContent: 'center',
        maxWidth: screenWidth,
        maxHeight: screenHeight,
        opacity,
        transform: [
          { scale: zoom },
          { rotate: `${angle}deg` }
        ]
      }}
      source={item.image[color]}
      resizeMode="contain"
    />
  }

  async onOverlayChange(index) {
    // Save index of overlay, to be restored as default for next time
    try {
      await AsyncStorage.setItem('savedIndex', index.toString())
    } catch (error) {
      // Error saving data
    }
  }

  render() {
    const { savedIndex, screenWidth } = this.props

    return (
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
          firstItem={savedIndex}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  swiper: {

  }
})

OverlayBrowser.propTypes = propTypes;
OverlayBrowser.defaultProps = defaultProps;

export default  OverlayBrowser
