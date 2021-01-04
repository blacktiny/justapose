/**
 *
 * Image Preview
 *
 */

import React, { createRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, View } from 'react-native';
import Slider from 'react-native-slider';
import ImageZoom from 'react-native-image-pan-zoom';
import ViewShot from 'react-native-view-shot';
import { useDispatch, useSelector } from 'react-redux';

import images from 'images';
import { styles } from './styles';
import { updateControlImage } from './actions';

const deviceWitdh = Dimensions.get('window').width;

export function ImagePreview(props) {
  // props
  const {
    sourceType,
    extractImageEnabled = false,
    transparentEnabled = false,
    zoomEnabled = false,
    extractFinished,
  } = props;

  // state
  const [transparency, setTransparency] = useState(0.5);

  // redux state
  const newImage = useSelector((state) => state.controller.newImage);
  const originImage = useSelector((state) => state.controller.originImage);

  let viewShotRef = createRef();
  const dispatch = useDispatch();

  const sourceImage = useMemo(() => {
    if (sourceType === 'New') {
      return newImage;
    }

    if (sourceType === 'Origin') {
      return originImage;
    }
  }, [newImage, originImage, sourceType]);

  useEffect(() => {
    if (!transparentEnabled) {
      setTransparency(sourceImage.transparency);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transparentEnabled]);

  useEffect(() => {
    if (extractImageEnabled) {
      if (zoomEnabled) {
        if (viewShotRef) {
          viewShotRef.capture().then((uri) => {
            if (uri) {
              dispatch(
                updateControlImage({
                  image: {
                    originUri: sourceImage.uri,
                    uri: uri,
                    rotate: 0,
                    transparency: transparency,
                  },
                  type: sourceType,
                }),
              );
              if (extractFinished) {
                extractFinished();
              }
            }
          });
        }
      } else {
        dispatch(
          updateControlImage({
            image: {
              ...sourceImage,
              transparency: transparency,
            },
            type: sourceType,
          }),
        );
        if (extractFinished) {
          extractFinished();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractImageEnabled]);

  const imageTransparencyChange = useCallback((value) => {
    setTransparency(value);
  }, []);

  const sliderOptions = {
    minimumTrackTintColor: 'lightgrey',
    maximumTrackTintColor: 'darkgrey',
    style: {
      width: deviceWitdh - 90,
      backgroundColor: '#f0f0f0',
      marginHorizontal: 10,
    },
  };

  if (!sourceImage.uri) {
    return <View />;
  }

  return (
    <View style={styles.imagePreviewWrapper}>
      <View style={styles.imagePreviewCotainer}>
        {zoomEnabled ? (
          <ViewShot
            ref={(ref) => {
              if (ref) {
                viewShotRef = ref;
              }
            }}
            style={styles.imagePreviewCotainer}
            options={{ format: 'jpg', quality: 0.9 }}>
            <ImageZoom
              cropWidth={deviceWitdh - 30}
              cropHeight={deviceWitdh - 30}
              imageWidth={deviceWitdh - 30}
              imageHeight={deviceWitdh - 30}>
              <Image
                source={{ isStatic: true, uri: sourceImage.uri }}
                resizeMode="cover"
                style={{
                  ...styles.imagePreview,
                  transform: [{ rotate: `${sourceImage.rotate}deg` }],
                  opacity: transparency,
                }}
              />
            </ImageZoom>
          </ViewShot>
        ) : (
          <Image
            source={{ isStatic: true, uri: sourceImage.uri }}
            resizeMode="cover"
            style={{
              ...styles.imagePreview,
              transform: [{ rotate: `${sourceImage.rotate}deg` }],
              opacity: transparency,
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
            <Slider value={transparency} onValueChange={(value) => imageTransparencyChange(value)} {...sliderOptions} />
            <Image source={images.opaque} resizeMode="contain" style={styles.transparencySliderImage} />
          </View>
        </View>
      )}
    </View>
  );
}

export default ImagePreview;
