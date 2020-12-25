/**
 *
 * Mix Blend Image Preview
 *
 */

import React from 'react';
import { Image } from 'react-native';
import {
  ColorBlend,
  ColorBurnBlend,
  DarkenBlend,
  DifferenceBlend,
  ExclusionBlend,
  HardLightBlend,
  HueBlend,
  LightenBlend,
  LuminosityBlend,
  ModulateBlend,
  MultiplyBlend,
  OverlayBlend,
  PlusBlend,
  SaturationBlend,
  ScreenBlend,
  SoftLightBlend,
} from 'react-native-image-filter-kit';

import { BLEND_MODE_TYPES } from './BlendModesList';
import { styles } from './styles';

export function MixBlendImagePreview(props) {
  const { originImage, newImage, blendMode, extractImageEnabled, onExtractImage } = props;

  const getOptions = () => {
    return {
      dstImage: renderOriginImage(),
      dstTransform: {
        scale: 'COVER',
        rotate: `${originImage.rotate + 180}deg`,
      },
      srcImage: renderNewImage(),
      srcTransform: { scale: 'COVER', rotate: `${newImage.rotate}deg` },
      onExtractImage: ({ nativeEvent }) => {
        onExtractImage(nativeEvent.uri);
      },
      extractImageEnabled: extractImageEnabled,
    };
  };

  const renderOriginImage = () => {
    return (
      <Image
        source={{ isStatic: true, uri: originImage.uri }}
        resizeMode="cover"
        style={{
          ...styles.imagePreview,
          opacity: originImage.opacity,
        }}
      />
    );
  };

  const renderNewImage = (position = 'relative') => {
    return (
      <Image
        source={{ isStatic: true, uri: newImage.uri }}
        resizeMode="cover"
        style={{ ...styles.imagePreview, position }}
      />
    );
  };

  const renderImageFilter = () => {
    switch (blendMode.mode) {
      case BLEND_MODE_TYPES.BLEND_NORMAL:
        return <SoftLightBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_MULTIPLY:
        return <MultiplyBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_COLOR_BURN:
        return <ColorBurnBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_DARKEN:
        return <DarkenBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_LIGHTEN:
        return <LightenBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_INVERT:
        return <ModulateBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_EXCLUSION:
        return <ExclusionBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_OVERLAY:
        return <OverlayBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_SCREEN:
        return <ScreenBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_SHARP:
        return <LuminosityBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_STEEP:
        return <SaturationBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_EMBER:
        return <HardLightBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_GLEAM:
        return <PlusBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_DOWN:
        return <DifferenceBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_HUE:
        return <HueBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_COLOR:
        return <ColorBlend {...getOptions()} />;
      default:
        return (
          <React.Fragment>
            {renderOriginImage()}
            {renderNewImage('absolute')}
          </React.Fragment>
        );
    }
  };

  return <React.Fragment>{renderImageFilter()}</React.Fragment>;
}

export default MixBlendImagePreview;
