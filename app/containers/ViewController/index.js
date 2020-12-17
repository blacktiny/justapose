/**
 *
 * View Controller
 *
 */

import React, { createRef, useCallback, useState } from 'react';
import { View, TouchableWithoutFeedback, SafeAreaView, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-picker';

import images from 'images';
import { styles } from './styles';

const FLASH_TYPE = {
  AUTO: 'auto',
  OFF: 'off',
  ON: 'on',
};

const CAMERA_TYPE = {
  FRONT: 'front',
  BACK: 'back',
};

const FLASH_IMAGES = {
  auto: images.flashAuto,
  off: images.flashOff,
  on: images.flashOn,
};

export function Home(props) {
  const [takingPicture, setTakingPicture] = useState(false);
  const [flashType, setFlashType] = useState(FLASH_TYPE.AUTO);
  const [cameraType, setCameraType] = useState(CAMERA_TYPE.FRONT);
  const [footerLeftBtnImg, setFooterLeftBtnImg] = useState(images.buttonCancel);
  const [footerRightBtnImg, setFooterRightBtnImg] = useState(images.buttonUpload);
  const [pictureUri, setPictureUri] = useState('');

  const cameraEleRef = createRef();

  const changeFlashType = useCallback(() => {
    if (flashType === FLASH_TYPE.AUTO) {
      setFlashType(FLASH_TYPE.OFF);
    } else if (flashType === FLASH_TYPE.OFF) {
      setFlashType(FLASH_TYPE.ON);
    } else if (flashType === FLASH_TYPE.ON) {
      setFlashType(FLASH_TYPE.AUTO);
    }
  }, [flashType]);

  const changeCameraType = useCallback(() => {
    if (cameraType === CAMERA_TYPE.FRONT) {
      setCameraType(CAMERA_TYPE.BACK);
    } else if (cameraType === CAMERA_TYPE.BACK) {
      setCameraType(CAMERA_TYPE.FRONT);
    }
  }, [cameraType]);

  // take a picture by camera
  const takePicture = async () => {
    if (cameraEleRef) {
      setTakingPicture(true);
      const options = { quality: 0.5, base64: true };
      const data = await cameraEleRef.takePictureAsync(options);
      console.log(data.uri);
      setTimeout(() => {
        setTakingPicture(false);
      }, 3000);
    }
  };

  // Upload a picture from photos or gallery
  const uploadPictureFromGallery = () => {
    var options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (res) => {
      console.log('Response = ', res);

      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        setPictureUri(source.uri);
      }
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/*   Header   */}
      <View>
        <Image source={images.logo} resizeMode="contain" style={styles.logo} />
        <Image source={images.counter} resizeMode="contain" style={styles.counter} />
      </View>

      {/*   Content   */}
      <View>
        {/*   Camera Controls   */}
        <View style={styles.cameraControls}>
          <TouchableWithoutFeedback onPress={changeFlashType}>
            <Image source={FLASH_IMAGES[flashType]} resizeMode="contain" style={styles.flashType} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={changeCameraType}>
            <Image source={images.flip} resizeMode="contain" style={styles.cameraType} />
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.cameraPreviewWrapper}>
          <View style={styles.takingPicture}>
            <View style={styles.takingPictureGreenHide}>
              <Image source={images.bigGreen} style={styles.takingPictureGreen} />
            </View>
            <View style={styles.takingPictureOrangeHide}>
              <Image source={images.bigOrange} style={styles.takingPictureOrange} />
            </View>
          </View>

          {/*   Camera Preview   */}
          <RNCamera
            ref={(ref) => {
              this.cameraEleRef = ref;
            }}
            style={styles.cameraPreview}
            type={RNCamera.Constants.Type[cameraType]}
            flashMode={RNCamera.Constants.FlashMode[flashType]}
          />
        </View>
      </View>

      {/*   Footer   */}
      <View style={styles.footer}>
        <Image source={images.tutShoot} resizeMode="contain" style={styles.tipImage} />

        <View style={styles.btnsGroupWrapper}>
          <View style={styles.footerBtnWrapper}>
            <TouchableWithoutFeedback onPress={() => props.navigation.navigate('Home')}>
              <Image source={footerLeftBtnImg} resizeMode="contain" style={styles.buttonImage} />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.footerBtnWrapper}>
            <TouchableWithoutFeedback onPress={takePicture}>
              <Image source={images.buttonCamera} resizeMode="contain" style={styles.cameraImage} />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.footerBtnWrapper}>
            <TouchableWithoutFeedback onPress={uploadPictureFromGallery}>
              <Image source={footerRightBtnImg} resizeMode="contain" style={styles.buttonImage} />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Home;
