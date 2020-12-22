/**
 *
 * Blend Modes List
 *
 */

import React, { useCallback, useRef } from 'react';
import { Animated, Image, View, TouchableWithoutFeedback } from 'react-native';

import images from 'images';
import { styles } from './styles';

export const MIX_BLEND_MODES = [
  {
    mode: 'normal',
    image: images.blendNormal,
  },
  {
    mode: 'multiply',
    image: images.blendMultiply,
  },
  {
    mode: 'color-burn',
    image: images.blendBurn,
  },
  {
    mode: 'darken',
    image: images.blendDarken,
  },
  {
    mode: 'lighten',
    image: images.blendLighten,
  },
  {
    mode: 'invert', //
    image: images.blendInvert,
  },
  {
    mode: 'exclusion',
    image: images.blendExclude,
  },
  {
    mode: 'overlay',
    image: images.blendOverlay,
  },
  {
    mode: 'screen',
    image: images.blendScreen,
  },
  {
    mode: 'sharp', //
    image: images.blendSharp,
  },
  {
    mode: 'steep', //
    image: images.blendSteep,
  },
  {
    mode: 'ember', //
    image: images.blendEmber,
  },
  {
    mode: 'gleam', //
    image: images.blendGleam,
  },
  {
    mode: 'down', //
    image: images.blendDown,
  },
  {
    mode: 'hue', //
    image: images.blendHue,
  },
  {
    mode: 'color', //
    image: images.blendColor,
  },
];

export function Home(props) {
  const { onBlendModeChanged } = props;

  const selectorAnim = useRef(new Animated.Value(0)).current;

  const selectBlendMode = useCallback(
    (index) => {
      Animated.timing(selectorAnim, {
        toValue: index * 70,
        duration: 500,
        useNativeDriver: false,
      }).start();

      onBlendModeChanged(MIX_BLEND_MODES[index]);
    },
    [onBlendModeChanged, selectorAnim],
  );

  return (
    <View style={styles.blendModeScrollView}>
      <View style={styles.blendModeList}>
        {MIX_BLEND_MODES.map((blendMode, index) => {
          return (
            <TouchableWithoutFeedback onPress={() => selectBlendMode(index)}>
              <Image key={blendMode.mode} source={blendMode.image} resizeMode="contain" style={styles.blendModeImage} />
            </TouchableWithoutFeedback>
          );
        })}
      </View>
      <Animated.View style={{ ...styles.underSelector, left: selectorAnim }}>
        <View style={styles.underSelector} />
      </Animated.View>
    </View>
  );
}

export default Home;
