/**
 *
 * View Controller
 *
 */

import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, View, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import Slider from 'react-native-slider';

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
  HOME: '1-Home',
  UPLOAD: '2-Upload',
  ROTATE: '3-Rotate',
  JUSTAPOSE: '4-JustAPose',
  BLEND: '5-Blend',
};

export function ViewController(props) {
  // Global
  const [controlStep, setControlStep] = useState(CONTROL_STEP.UPLOAD);
  const [pictureInfo, setPictureInfo] = useState({
    rotate: 0,
    uri: '',
  });
  const [nextPictureInfo, setNextPictureInfo] = useState({
    rotate: 0,
    uri: '',
  });
  const [controlTooltipInfo, setControlTooltipInfo] = useState({
    addAnother: false,
    saveit: false,
    tutShoot: false,
  });

  // In Upload Step
  const [takingPicture, setTakingPicture] = useState(false);
  const [flashType, setFlashType] = useState(FLASH_TYPE.AUTO);
  const [cameraType, setCameraType] = useState(CAMERA_TYPE.FRONT);

  // In Just A Pose Step
  const [justOpacity, setJustOpacity] = useState(0.5);

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
        setControlTooltipInfo({
          ...controlTooltipInfo,
          tutShoot: true,
        });
        setFooterControlBtn({
          image: images.buttonCamera,
          style: styles.cameraImage,
        });
        setFooterRightBtnImg(images.buttonUpload);
        break;
      case CONTROL_STEP.ROTATE:
        setControlTooltipInfo({
          ...controlTooltipInfo,
          tutShoot: false,
        });
        setFooterControlBtn({
          image: images.rotate,
          style: styles.rotateImage,
        });
        setFooterRightBtnImg(images.buttonUse);
        break;
      case CONTROL_STEP.JUSTAPOSE:
        setControlTooltipInfo({
          ...controlTooltipInfo,
          tutShoot: true,
        });
        setFooterControlBtn({
          image: images.buttonCamera,
          style: styles.cameraImage,
        });
        setFooterRightBtnImg(images.buttonUpload);
        setFooterLeftBtnImg(images.buttonCancel);
        break;
      case CONTROL_STEP.BLEND:
        setControlTooltipInfo({
          addAnother: true,
          saveit: true,
          tutShoot: false,
        });
        setFooterControlBtn({
          image: images.buttonCamera,
          style: styles.cameraImage,
        });
        setFooterRightBtnImg(images.buttonNext);
        setFooterLeftBtnImg(images.buttonHome);
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlStep]);

  const { isShowCameraPreview, isShowImagePreview, isShowNextImagePreview, isShowOpacitySlider } = useMemo(() => {
    let showCameraPreview = false;
    let showOpacitySlider = false;
    let showImagePreview = false;
    let showNextImagePreview = false;

    switch (controlStep) {
      case CONTROL_STEP.UPLOAD:
        showCameraPreview = true;
        break;
      case CONTROL_STEP.ROTATE:
        showImagePreview = true;
        break;
      case CONTROL_STEP.JUSTAPOSE:
        showCameraPreview = true;
        showOpacitySlider = true;
        showImagePreview = true;
        break;
      case CONTROL_STEP.BLEND:
        showImagePreview = true;
        showNextImagePreview = true;
        break;
      default:
        break;
    }

    return {
      isShowCameraPreview: showCameraPreview,
      isShowImagePreview: showImagePreview,
      isShowNextImagePreview: showNextImagePreview,
      isShowOpacitySlider: showOpacitySlider,
    };
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

  //
  const gotoNextStep = useCallback(() => {
    switch (controlStep) {
      case CONTROL_STEP.UPLOAD:
        uploadPictureFromGallery();
        break;
      case CONTROL_STEP.ROTATE:
        setControlStep(CONTROL_STEP.JUSTAPOSE);
        break;
      case CONTROL_STEP.JUSTAPOSE:
        uploadPictureFromGallery();
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlStep]);

  //
  const backToPrevStep = useCallback(() => {
    switch (controlStep) {
      case CONTROL_STEP.UPLOAD:
        props.navigation.navigate('Home');
        break;
      case CONTROL_STEP.ROTATE:
        setControlStep(CONTROL_STEP.UPLOAD);
        break;
      case CONTROL_STEP.JUSTAPOSE:
        setControlStep(CONTROL_STEP.ROTATE);
        break;
      case CONTROL_STEP.BLEND:
        Alert.alert(
          'Question',
          'This will delete your current just-a-pose',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: () => deleteCurrentJustapose(),
            },
          ],
          {
            cancelable: true,
          },
        );
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlStep, props.navigation]);

  const handleControlBtnClicked = useCallback(() => {
    switch (controlStep) {
      case CONTROL_STEP.UPLOAD:
        takePicture();
        break;
      case CONTROL_STEP.ROTATE:
        // alert(pictureInfo);
        setPictureInfo({
          ...pictureInfo,
          rotate: (pictureInfo.rotate + 90) % 360,
        });
        break;
      case CONTROL_STEP.JUSTAPOSE:
        takePicture();
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlStep, pictureInfo]);

  // take a picture by camera
  const takePicture = async () => {
    if (cameraEleRef && !takingPicture) {
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
      if (controlStep === CONTROL_STEP.UPLOAD) {
        setPictureInfo({ rotate: 0, uri: data.uri });
      } else if (controlStep === CONTROL_STEP.JUSTAPOSE) {
        setNextPictureInfo({ rotate: 0, uri: data.uri });
      }
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

        setTimeout(() => {
          if (controlStep === CONTROL_STEP.UPLOAD) {
            setControlStep(CONTROL_STEP.ROTATE);
          } else if (controlStep === CONTROL_STEP.JUSTAPOSE) {
            setControlStep(CONTROL_STEP.BLEND);
          }
        }, 1000);
      }, 1000);
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
        if (controlStep === CONTROL_STEP.UPLOAD) {
          setPictureInfo({ rotate: 0, uri: source.uri });
        } else if (controlStep === CONTROL_STEP.JUSTAPOSE) {
          setNextPictureInfo({ rotate: 0, uri: source.uri });
        }
        if (controlStep === CONTROL_STEP.UPLOAD) {
          setControlStep(CONTROL_STEP.ROTATE);
        } else if (controlStep === CONTROL_STEP.JUSTAPOSE) {
          setControlStep(CONTROL_STEP.BLEND);
        }
      }
    });
  };

  // Delete the current taken pictures.
  const deleteCurrentJustapose = () => {
    setPictureInfo({
      rotate: 0,
      uri: '',
    });
    setNextPictureInfo({
      rotate: 0,
      uri: '',
    });
    setControlStep(CONTROL_STEP.HOME);
    props.navigation.navigate('Home');
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
        {isShowCameraPreview && (
          <View style={styles.cameraControls}>
            <TouchableWithoutFeedback onPress={changeFlashType}>
              <Image source={FLASH_IMAGES[flashType]} resizeMode="contain" style={styles.flashType} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={changeCameraType}>
              <Image source={images.flip} resizeMode="contain" style={styles.cameraType} />
            </TouchableWithoutFeedback>
          </View>
        )}

        <View style={styles.cameraPreviewContainer}>
          {/*   Camera Preview   */}
          {isShowCameraPreview && (
            <RNCamera
              ref={(ref) => {
                if (ref) {
                  cameraEleRef = ref;
                }
              }}
              style={styles.cameraPreview}
              type={RNCamera.Constants.Type[cameraType]}
              flashMode={RNCamera.Constants.FlashMode[flashType]}
            />
          )}

          {isShowNextImagePreview && (
            <View>
              {nextPictureInfo.uri !== '' && (
                <Image
                  source={{ isStatic: true, uri: nextPictureInfo.uri }}
                  resizeMode="contain"
                  style={styles.imagePreview}
                />
              )}
            </View>
          )}

          {isShowImagePreview && (
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                marginTop: isShowCameraPreview || isShowNextImagePreview ? -(deviceWitdh + 28) : 0,
                opacity: controlStep >= CONTROL_STEP.JUSTAPOSE ? justOpacity : 1,
              }}>
              {/*   Image Preview   */}
              {pictureInfo && (
                <View
                  style={{
                    ...styles.imagePreviewWrapper,
                    transform: [{ rotate: `${pictureInfo.rotate}deg` }],
                  }}>
                  {pictureInfo.uri !== '' && (
                    <Image
                      source={{ isStatic: true, uri: pictureInfo.uri }}
                      resizeMode="contain"
                      style={styles.imagePreview}
                    />
                  )}
                </View>
              )}
            </View>
          )}

          {/*   Taking a Picture Animation   */}
          {isShowCameraPreview && (
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
          )}
        </View>
      </View>

      {isShowOpacitySlider && (
        <View style={styles.opacitySliderContainer}>
          <Image source={images.adjustTrans} resizeMode="contain" style={styles.adjustTransTip} />
          <Slider value={justOpacity} onValueChange={(value) => setJustOpacity(value)} />
        </View>
      )}

      {/*   Footer   */}
      <View style={styles.footer}>
        {/*   Control Tip Images   */}
        {controlTooltipInfo.addAnother && (
          <Image source={images.addAnother} resizeMode="contain" style={styles.addAnotherTip} />
        )}
        {controlTooltipInfo.saveit && <Image source={images.saveit} resizeMode="contain" style={styles.saveitTip} />}
        {controlTooltipInfo.tutShoot && (
          <Image source={images.tutShoot} resizeMode="contain" style={styles.tutShootTip} />
        )}

        {/*   Control Buttons   */}
        <View style={styles.btnsGroupWrapper}>
          <View style={styles.footerBtnWrapper}>
            <TouchableWithoutFeedback onPress={() => backToPrevStep()}>
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

export default ViewController;
