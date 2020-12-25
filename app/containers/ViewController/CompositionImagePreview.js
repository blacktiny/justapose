/**
 *
 * Mix Blend Image Preview
 *
 */

import React from 'react';
import { Image, View } from 'react-native';
import { DstOverComposition, SrcOverComposition } from 'react-native-image-filter-kit';

import { styles } from './styles';

export function CompositionImagePreview(props) {
  const { originImage, newImage, extractImageEnabled, onExtractImage } = props;

  const getOptions = () => {
    return {
      dstImage: null,
      dstTransform: { scale: 'CONTAIN' },
      srcImage: renderSrcImage(),
      srcTransform: { scale: 'CONTAIN' },
      onExtractImage: ({ nativeEvent }) => {
        console.log('nativeEvent = ', nativeEvent);
        onExtractImage(nativeEvent.uri);
      },
      extractImageEnabled: extractImageEnabled,
    };
  };

  // const renderDstImage = () => {
  //   return (
  //     <Image
  //       source={{ isStatic: true, uri: newImage.uri }}
  //       resizeMode="cover"
  //       style={{ ...styles.imagePreview, transform: [{ rotate: `${newImage.rotate}deg` }], opacity: 0.5 }}
  //     />
  //   );
  // };

  const renderSrcImage = () => {
    return (
      <View>
        <Image
          source={{ isStatic: true, uri: newImage.uri }}
          resizeMode="cover"
          style={{ ...styles.imagePreview, transform: [{ rotate: `${newImage.rotate}deg` }] }}
        />
        <Image
          source={{ isStatic: true, uri: originImage.uri }}
          resizeMode="cover"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            ...styles.imagePreview,
            position: 'absolute',
            transform: [{ rotate: `${originImage.rotate}deg` }],
            opacity: originImage.opacity,
          }}
        />
      </View>
    );
  };

  return (
    <React.Fragment>
      <DstOverComposition {...getOptions()} />
    </React.Fragment>
  );
}

export default CompositionImagePreview;
