/**
 *
 * Home - All Photo
 *
 */

import React, { useCallback } from 'react';
import { Image, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import RNFS from 'react-native-fs';

import { Header } from '../ViewController';
import images from 'images';
import { styles } from './styles';
import { deleteImage } from '../ViewController/actions';

export function GalleryImagePreview(props) {
  const { selectedUri } = props;

  const dispatch = useDispatch();

  const handlerRemoveImage = useCallback(() => {
    // delete image from iphone directory
    RNFS.unlink(selectedUri)
      // spread is a method offered by bluebird to allow for more than a
      // single return value of a promise. If you use `then`, you will receive
      // the values inside of an array
      .then((path) => {
        console.log('FILE DELETED', path);
      })
      // `unlink` will throw an error, if the item to unlink does not exist
      .catch((err) => {
        console.log(err.message);
      });

    // delete image from redux-store
    dispatch(deleteImage(selectedUri));

    props.navigation.navigate('ImageGallery');
  }, [dispatch, props.navigation, selectedUri]);

  return (
    <SafeAreaView style={styles.screen}>
      {/*   Header   */}
      <Header />

      {/*   Content   */}
      <View style={styles.imagePreview}>
        <Image source={{ isStatic: true, uri: selectedUri }} resizeMode="cover" style={styles.image} />
      </View>

      {/*   Footer   */}
      <View style={styles.btnsGroupWrapper}>
        <View style={styles.footerBtnWrapper}>
          <TouchableOpacity onPress={() => props.navigation.navigate('ImageGallery')}>
            <Image source={images.buttonBack} resizeMode="contain" style={styles.buttonImage} />
          </TouchableOpacity>
        </View>
        <View style={styles.footerBtnWrapper}>
          <TouchableOpacity onPress={() => handlerRemoveImage()}>
            <Image source={images.buttonDelete} resizeMode="contain" style={styles.buttonDelete} />
          </TouchableOpacity>
        </View>
        <View style={styles.footerBtnWrapper}>
          <TouchableOpacity onPress={() => {}}>
            <Image source={images.buttonShare} resizeMode="contain" style={styles.buttonImage} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const mapStateToProps = (state) => ({ selectedUri: state.controller.selected });

export default connect(mapStateToProps)(GalleryImagePreview);
