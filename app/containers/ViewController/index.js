/**
 *
 * View Controller
 *
 */

import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, View, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { launchImageLibrary } from 'react-native-image-picker';

import images from 'images';
import { styles } from './styles';

const deviceWitdh = Dimensions.get('window').width;

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

const CONTROL_STEP = {
  UPLOAD: 'upload',
  ROTATE: 'rotate',
};

export function Home(props) {
  // Global
  const [controlStep, setControlStep] = useState(CONTROL_STEP.UPLOAD);
  const [pictureInfo, setPictureInfo] = useState({
    rotate: 0,
    uri: '',
  });
  const [controlTooltipInfo, setControlTooltipInfo] = useState({
    image: images.tutShoot,
    style: styles.tutShootTip,
  });

  // In Upload Step
  const [takingPicture, setTakingPicture] = useState(false);
  const [flashType, setFlashType] = useState(FLASH_TYPE.AUTO);
  const [cameraType, setCameraType] = useState(CAMERA_TYPE.FRONT);

  // Footer Control Buttons
  const [footerLeftBtnImg, setFooterLeftBtnImg] = useState(images.buttonCancel);
  const [footerControlBtn, setFooterControlBtn] = useState({
    image: images.buttonCamera,
    style: styles.cameraImage,
  });
  const [footerRightBtnImg, setFooterRightBtnImg] = useState(images.buttonUpload);

  let cameraEleRef = createRef();

  const slide2LeftAnim = useRef(new Animated.Value(deviceWitdh + 50)).current;
  const slide2RightAnim = useRef(new Animated.Value(-(deviceWitdh + 150))).current;

  useEffect(() => {
    switch (controlStep) {
      case CONTROL_STEP.UPLOAD:
        break;
      case CONTROL_STEP.ROTATE:
        setControlTooltipInfo(null);
        setFooterControlBtn({
          image: images.rotate,
          style: images.rotateImage,
        });
        setFooterRightBtnImg(images.buttonUse);
        break;
      default:
        break;
    }
  }, [controlStep]);

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

  const gotoNextStep = useCallback(() => {
    switch (controlStep) {
      case CONTROL_STEP.UPLOAD:
        uploadPictureFromGallery();
        break;
      case CONTROL_STEP.ROTATE:

      default:
        break;
    }
  }, [controlStep, pictureInfo]);

  const handleControlBtnClicked = useCallback(() => {
    switch (controlStep) {
      case CONTROL_STEP.UPLOAD:
        if (!takingPicture) {
          takePicture();
        }
        break;
      case CONTROL_STEP.ROTATE:
        setPictureInfo({
          ...pictureInfo,
          rotate: (pictureInfo.rotate + 90) % 360,
        });
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlStep, pictureInfo, takingPicture]);

  // take a picture by camera
  const takePicture = async () => {
    if (cameraEleRef) {
      setTakingPicture(true);
      Animated.timing(slide2RightAnim, {
        toValue: -(deviceWitdh / 2 - 50),
        duration: 500,
        useNativeDriver: false,
      }).start();
      Animated.timing(slide2LeftAnim, {
        toValue: deviceWitdh / 2 - 50,
        duration: 500,
        useNativeDriver: false,
      }).start();

      const options = { quality: 0.5, base64: true };
      const data = await cameraEleRef.takePictureAsync(options);
      setPictureInfo({ rotate: 0, uri: data.uri });
      // console.log(data.uri);

      setTimeout(() => {
        setTakingPicture(false);
        Animated.timing(slide2RightAnim, {
          toValue: -(deviceWitdh + 150),
          duration: 500,
          useNativeDriver: false,
        }).start();
        Animated.timing(slide2LeftAnim, {
          toValue: deviceWitdh + 50,
          duration: 500,
          useNativeDriver: false,
        }).start();

        setControlStep(CONTROL_STEP.ROTATE);
      }, 1500);
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

    launchImageLibrary(options, (res) => {
      console.log('Response = ', res);

      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        // alert(res.customButton);
      } else {
        let source = res;
        setPictureInfo({ rotate: 0, uri: source.uri });
        setControlStep(CONTROL_STEP.ROTATE);
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
        {controlStep === CONTROL_STEP.UPLOAD && (
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
              <View style={styles.cameraPreviewContainer}>
                {/*   Camera Preview   */}
                <RNCamera
                  ref={(ref) => {
                    cameraEleRef = ref;
                  }}
                  style={styles.cameraPreview}
                  type={RNCamera.Constants.Type[cameraType]}
                  flashMode={RNCamera.Constants.FlashMode[flashType]}
                />

                {/*   Taking a Picture Animation   */}
                <View style={styles.takingPicture}>
                  <Animated.View style={{ ...styles.takingPictureGreen, marginLeft: slide2RightAnim }}>
                    <View style={styles.takingPictureGreenHide}>
                      <Image source={images.bigGreen} style={styles.takingPictureGreen} />
                    </View>
                  </Animated.View>
                  <Animated.View style={{ ...styles.takingPictureOrange, marginLeft: slide2LeftAnim }}>
                    <View style={styles.takingPictureOrangeHide}>
                      <Image source={images.bigOrange} style={styles.takingPictureOrange} />
                    </View>
                  </Animated.View>
                </View>
              </View>
            </View>
          </View>
        )}

        {controlStep === CONTROL_STEP.ROTATE && (
          <View>
            {/*   Image Preview   */}
            {pictureInfo && (
              <View
                style={{
                  ...styles.imagePreviewWrapper,
                  transform: [{ rotate: `${pictureInfo.rotate}deg` }],
                }}>
                <Image
                  source={{ isStatic: true, uri: pictureInfo.uri }}
                  resizeMode="contain"
                  style={styles.imagePreview}
                />
              </View>
            )}
          </View>
        )}
      </View>

      {/*   Footer   */}
      <View style={styles.footer}>
        {controlTooltipInfo && (
          <Image source={controlTooltipInfo.image} resizeMode="contain" style={controlTooltipInfo.style} />
        )}

        <View style={styles.btnsGroupWrapper}>
          <View style={styles.footerBtnWrapper}>
            <TouchableWithoutFeedback onPress={() => props.navigation.navigate('Home')}>
              <Image source={footerLeftBtnImg} resizeMode="contain" style={styles.buttonImage} />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.footerBtnWrapper}>
            <TouchableWithoutFeedback onPress={() => handleControlBtnClicked()}>
              <Image source={footerControlBtn.image} resizeMode="contain" style={footerControlBtn.style} />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.footerBtnWrapper}>
            <TouchableWithoutFeedback onPress={() => gotoNextStep()}>
              <Image source={footerRightBtnImg} resizeMode="contain" style={styles.buttonImage} />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Home;
