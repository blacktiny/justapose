/**
 *
 * Preview for Mix Blend Images
 *
 */

import React from 'react';
import { Image, View } from 'react-native';
import {
  ColorBlend,
  ColorBurnBlend,
  ColorDodgeBlend,
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
  const { originImage, newImage, blendMode } = props;

  const getOptions = () => {
    return {
      dstImage: renderOriginImage(),
      dstTransform: { scale: 'CONTAIN', rotate: `${originImage.rotate + 180}deg` },
      srcImage: renderNewImage(),
      srcTransform: { scale: 'CONTAIN', rotate: `${newImage.rotate + 180}deg` },
    };
  };

  const renderOriginImage = () => {
    return (
      <Image
        source={{ isStatic: true, uri: originImage.uri }}
        resizeMode="contain"
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
        resizeMode="contain"
        style={{ ...styles.imagePreview, position }}
      />
    );
  };

  const renderImageFilter = () => {
    switch (blendMode.mode) {
      case BLEND_MODE_TYPES.BLEND_NORMAL:
        return <DifferenceBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_MULTIPLY:
        return <MultiplyBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_COLOR_BURN:
        return <ColorBurnBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_DARKEN:
        return <DarkenBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_LIGHTEN:
        return <LightenBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_EXCLUSION:
        return <ExclusionBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_OVERLAY:
        return <OverlayBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_HUE:
        return <HueBlend {...getOptions()} />;
      case BLEND_MODE_TYPES.BLEND_COLOR:
        return <ColorBlend {...getOptions()} />;
      default:
        return (
          <React.Fragment>
            {renderNewImage('absolute')}
            {renderOriginImage()}
          </React.Fragment>
        );
    }
  };

  return <React.Fragment>{renderImageFilter()}</React.Fragment>;
}

export default MixBlendImagePreview;
