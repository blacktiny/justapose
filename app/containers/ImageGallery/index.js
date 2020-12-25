/**
 *
 * Home - All Photo
 *
 */

import React, { useCallback, useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { connect, useDispatch } from 'react-redux';

import images from 'images';
import { styles } from './styles';
import { selectImage } from '../ViewController/actions';

const DEFAULT_GALLERY_COUNT = 6;

export function ImageGallery(props) {
  const { gallery } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    if (gallery.length < 1) {
      props.navigation.navigate('Home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gallery]);

  const emptyImagesCount = DEFAULT_GALLERY_COUNT - gallery.length;

  const handlerSelectImage = useCallback(
    (imageUri) => {
      console.log('[handlerSelectImage] image = ', imageUri);
      dispatch(selectImage(imageUri));
      props.navigation.navigate('GalleryImagePreview');
    },
    [dispatch, props.navigation],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Image source={images.logo} resizeMode="contain" style={styles.logo} />

      <ScrollView contentContainerStyle={styles.scrollView}>
        {gallery.length > 0 &&
          gallery.map((imageUri, index) => {
            return (
              <TouchableOpacity style={styles.imageContainer} key={index} onPress={() => handlerSelectImage(imageUri)}>
                <Image source={{ uri: imageUri }} resizeMode="cover" style={styles.galleryImage} />
              </TouchableOpacity>
            );
          })}
        {emptyImagesCount > 0 &&
          Array(emptyImagesCount)
            .fill(1)
            .map((_value, index) => {
              return (
                <View style={styles.imageContainer} key={index + DEFAULT_GALLERY_COUNT}>
                  <Image source={images.previewBackground} resizeMode="cover" style={styles.galleryImage} />
                </View>
              );
            })}
      </ScrollView>

      <TouchableWithoutFeedback onPress={() => props.navigation.navigate('ViewController')}>
        <Image source={images.buttonCamera} resizeMode="contain" style={styles.cameraImage} />
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const mapStateToProps = (state) => ({ gallery: state.controller.images });

export default connect(mapStateToProps)(ImageGallery);
