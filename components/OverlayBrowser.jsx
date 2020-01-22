import React from 'react'
import PropTypes from 'prop-types';
import { View, Image, AsyncStorage } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { styles, screenWidth } from '../styles/App'
import { overlays } from '../assets'

const propTypes = {
  zoom: PropTypes.number,
  savedIndex: PropTypes.number,
  color: PropTypes.string
};

const defaultProps = {
  zoom: 1,
  color: 'white'
};

class OverlayBrowser extends React.Component {
  renderOverlay({item, index}) {
    const { zoom, color } = this.props
    return <Image
      style={{
        ...styles.overlayImage,
        transform: [{ scale: zoom }]
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
    const { savedIndex } = this.props

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

OverlayBrowser.propTypes = propTypes;
OverlayBrowser.defaultProps = defaultProps;

export default  OverlayBrowser
