/**
 *
 * Home - All Photo
 *
 */

import React from 'react';
import { View, TouchableWithoutFeedback, SafeAreaView, Image } from 'react-native';

import images from 'images';
import { styles } from './styles';

export function Home(props) {
  return (
    <SafeAreaView style={styles.screen}>
      <Image source={images.screenHome} resizeMode="contain" style={styles.allPhoto} />
      <View style={styles.cemeraView}>
        <TouchableWithoutFeedback onPress={() => props.navigation.navigate('ViewController')}>
          <Image source={images.buttonCamera} resizeMode="contain" style={styles.cameraImage} />
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}

export default Home;
