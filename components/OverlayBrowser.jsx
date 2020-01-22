import React from 'react'
import PropTypes from 'prop-types';
import { View, Image, AsyncStorage } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { styles, screenWidth } from '../styles/App'
import { overlays } from '../overlays'

const propTypes = {
  lastOverlay: PropTypes.number,
  zoom: PropTypes.number,
  color: PropTypes.string
};
const defaultProps = {
  lastOverlay: 0,
  zoom: 1
};

class OverlayBrowser extends React.Component {
  state = {
    overlay: 0    
  }

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

  async onOverlayChange (index) {
    this.setState({ mode: index })
    try {
      await AsyncStorage.setItem('overlay', index.toString())
    } catch (error) {
      // Error saving data
    }
  }

  render() {
    const { lastOverlay } = this.props

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
          firstItem={lastOverlay}
        />
      </View>
    );
  }
}

OverlayBrowser.propTypes = propTypes;
OverlayBrowser.defaultProps = defaultProps;

export default  OverlayBrowser
