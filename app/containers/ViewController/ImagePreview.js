/**
 *
 * Image Preview
 *
 */

import React, { useCallback, useEffect } from 'react';
import { Dimensions, Image, View } from 'react-native';
import Slider from 'react-native-slider';

import images from 'images';
import { styles } from './styles';

const deviceWitdh = Dimensions.get('window').width;

export function ImagePreview(props) {
  const { source, onUpdatedImage, transparentEnabled = false } = props;

  useEffect(() => {
    if (transparentEnabled) {
      onUpdatedImage({ ...source, transparency: 0.5 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const imageTransparencyChange = useCallback(
    (value) => {
      if (onUpdatedImage) {
        onUpdatedImage({
          ...source,
          transparency: value,
        });
      }
    },
    [onUpdatedImage, source],
  );

  const sliderOptions = {
    minimumTrackTintColor: 'lightgrey',
    maximumTrackTintColor: 'darkgrey',
    style: {
      width: deviceWitdh - 90,
      backgroundColor: 'linear-gradient(#f0f0f0, #0f0f0f)',
      marginHorizontal: 10,
    },
  };

  if (!source.uri) {
    return <View />;
  }

  return (
    <View style={styles.imagePreviewWrapper}>
      <View style={styles.imagePreviewCotainer}>
        {source.uri !== '' && (
          <Image
            source={{ isStatic: true, uri: source.uri }}
            resizeMode="cover"
            style={{
              ...styles.imagePreview,
              transform: [{ rotate: `${source.rotate}deg` }],
              opacity: source.transparency,
            }}
          />
        )}
      </View>

      {/*   slider for transparency   */}
      {transparentEnabled && (
        <View style={styles.opacitySliderWrapper}>
          <Image source={images.adjustTrans} resizeMode="contain" style={styles.adjustTransTip} />

          <View style={styles.opacitySliderContainer}>
            <Image source={images.transparent} resizeMode="contain" style={styles.transparencySliderImage} />
            <Slider
              value={source.transparency}
              onValueChange={(value) => imageTransparencyChange(value)}
              {...sliderOptions}
            />
            <Image source={images.opaque} resizeMode="contain" style={styles.transparencySliderImage} />
          </View>
        </View>
      )}
    </View>
  );
}

export default ImagePreview;
