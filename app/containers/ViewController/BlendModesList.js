/**
 *
 * Blend Modes List
 *
 */

import React, { useCallback, useRef } from 'react';
import { Animated, Image, View, TouchableWithoutFeedback } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import images from 'images';
import { styles } from './styles';

export const BLEND_MODE_TYPES = {
  BLEND_NORMAL: 'normal',
  BLEND_MULTIPLY: 'multiply',
  BLEND_COLOR_BURN: 'color-burn',
  BLEND_DARKEN: 'darken',
  BLEND_LIGHTEN: 'lighten',
  BLEND_INVERT: 'invert',
  BLEND_EXCLUSION: 'exclusion',
  BLEND_OVERLAY: 'overlay',
  BLEND_SCREEN: 'screen',
  BLEND_SHARP: 'sharp',
  BLEND_STEEP: 'steep',
  BLEND_EMBER: 'ember',
  BLEND_GLEAM: 'gleam',
  BLEND_DOWN: 'down',
  BLEND_HUE: 'hue',
  BLEND_COLOR: 'color',
};

export const MIX_BLEND_MODES = [
  {
    mode: BLEND_MODE_TYPES.BLEND_NORMAL,
    image: images.blendNormal,
  },
  {
    mode: BLEND_MODE_TYPES.BLEND_MULTIPLY,
    image: images.blendMultiply,
  },
  {
    mode: BLEND_MODE_TYPES.BLEND_COLOR_BURN,
    image: images.blendBurn,
  },
  {
    mode: BLEND_MODE_TYPES.BLEND_DARKEN,
    image: images.blendDarken,
  },
  {
    mode: BLEND_MODE_TYPES.BLEND_LIGHTEN,
    image: images.blendLighten,
  },
  {
    mode: BLEND_MODE_TYPES.BLEND_INVERT,
    image: images.blendInvert,
  },
  {
    mode: BLEND_MODE_TYPES.BLEND_EXCLUSION,
    image: images.blendExclude,
  },
  {
    mode: BLEND_MODE_TYPES.BLEND_OVERLAY,
    image: images.blendOverlay,
  },
  {
    mode: BLEND_MODE_TYPES.BLEND_SCREEN,
    image: images.blendScreen,
  },
  {
    mode: BLEND_MODE_TYPES.BLEND_SHARP,
    image: images.blendSharp,
  },
  {
    mode: BLEND_MODE_TYPES.BLEND_STEEP,
    image: images.blendSteep,
  },
  {
    mode: BLEND_MODE_TYPES.BLEND_EMBER,
    image: images.blendEmber,
  },
  {
    mode: BLEND_MODE_TYPES.BLEND_GLEAM,
    image: images.blendGleam,
  },
  {
    mode: BLEND_MODE_TYPES.BLEND_DOWN,
    image: images.blendDown,
  },
  {
    mode: BLEND_MODE_TYPES.BLEND_HUE,
    image: images.blendHue,
  },
  {
    mode: BLEND_MODE_TYPES.BLEND_COLOR,
    image: images.blendColor,
  },
];

const BLEND_ITEM_WIDTH = 70;

export function BlendModesList(props) {
  const { onBlendModeChanged } = props;

  const selectorAnim = useRef(new Animated.Value(20)).current;

  const selectBlendMode = useCallback(
    (index) => {
      Animated.timing(selectorAnim, {
        toValue: index * BLEND_ITEM_WIDTH + 20,
        duration: 500,
        useNativeDriver: false,
      }).start();

      onBlendModeChanged(MIX_BLEND_MODES[index]);
    },
    [onBlendModeChanged, selectorAnim],
  );

  return (
    <View style={styles.blendModeScrollView}>
      <FlatList
        contentContainerStyle={styles.blendModeList}
        data={MIX_BLEND_MODES}
        horizontal
        ListFooterComponent={() => {
          return (
            <Animated.View style={{ ...styles.underSelector, left: selectorAnim }}>
              <View style={styles.underSelector} />
            </Animated.View>
          );
        }}
        ListFooterComponentStyle={styles.underSelectorWrapper}
        renderItem={({ item, index }) => {
          return (
            <TouchableWithoutFeedback onPress={() => selectBlendMode(index)}>
              <Image source={item.image} resizeMode="cover" style={styles.blendModeImage} />
            </TouchableWithoutFeedback>
          );
        }}
        keyExtractor={(item) => item.mode}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

export default BlendModesList;
