/**
 *
 * Home - All Photo
 *
 */

import React, { useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { connect } from 'react-redux';

import images from 'images';
import { styles } from './styles';

const DEFAULT_GALLERY_COUNT = 6;

export function ImageGallery(props) {
  const { gallery } = props;

  useEffect(() => {
    if (gallery.length < 1) {
      props.navigation.navigate('Home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emptyImagesCount = DEFAULT_GALLERY_COUNT - gallery.length;

  return (
    <SafeAreaView style={styles.screen}>
      <Image source={images.logo} resizeMode="cover" style={styles.logo} />

      <ScrollView contentContainerStyle={styles.scrollView}>
        {gallery.length > 0 &&
          gallery.map((image, index) => {
            return (
              <TouchableOpacity style={styles.imageContainer} key={index}>
                <Image source={{ uri: image }} resizeMode="cover" style={styles.galleryImage} />
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
        <Image source={images.buttonCamera} resizeMode="cover" style={styles.cameraImage} />
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const mapStateToProps = (state) => ({ gallery: state.controller.images });

export default connect(mapStateToProps)(ImageGallery);
