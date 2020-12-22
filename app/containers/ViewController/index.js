/**
 *
 * View Controller
 *
 */

import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, View, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RNCamera } from 'react-native-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import Slider from 'react-native-slider';
import { captureScreen } from 'react-native-view-shot';
import ImageEditor from '@react-native-community/image-editor';

import BlendModesList, { MIX_BLEND_MODES } from './BlendModesList';
import MixBlendImagePreview from './MixBlendImagePreview';
import images from 'images';
import { styles } from './styles';

const deviceWitdh = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

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
  ADDJUST: '2-JustAPose',
  ROTATE: '3-Rotate',
  PREVIEW: '4-Preview',
  BLEND: '5-Blend',
};

export function Header() {
  return (
    <View>
      <Image source={images.logo} resizeMode="contain" style={styles.logo} />
      <Image source={images.counter} resizeMode="contain" style={styles.counter} />
    </View>
  );
}

export function ViewController(props) {
  // Global
  const [currentControlStep, setCurrentControlStep] = useState(CONTROL_STEP.ADDJUST);
  const [previewControlStep, setPreviewControlStep] = useState(CONTROL_STEP.HOME);
  const [originImage, setOriginImage] = useState({
    rotate: 0,
    uri: '',
  });
  const [newImage, setNewImage] = useState({
    rotate: 0,
    uri: '',
  });
  const [mixedImages, setMixedImages] = useState([]);
  const [controlTooltipInfo, setControlTooltipInfo] = useState({
    addAnother: false,
    saveit: false,
    tutShoot: false,
  });

  // In Add New Just A Pose Image Step
  const [takingPicture, setTakingPicture] = useState(false);
  const [flashType, setFlashType] = useState(FLASH_TYPE.AUTO);
  const [cameraType, setCameraType] = useState(CAMERA_TYPE.FRONT);

  //
  const [justOpacity, setJustOpacity] = useState(0.5);

  // Footer Control Buttons
  const [footerLeftBtnImg, setFooterLeftBtnImg] = useState(images.buttonCancel);
  const [footerControlBtn, setFooterControlBtn] = useState({
    image: images.buttonCamera,
    style: styles.cameraImage,
  });
  const [footerRightBtnImg, setFooterRightBtnImg] = useState(images.buttonUpload);

  // Blend Mode
  const [blendMode, setBlendMode] = useState(MIX_BLEND_MODES[0]); // default mode = Normal

  let cameraEleRef = createRef();

  const slide2LeftAnim = useRef(new Animated.Value(deviceWitdh + 50)).current;
  const slide2RightAnim = useRef(new Animated.Value(-(deviceWitdh + 150))).current;

  useEffect(() => {
    switch (currentControlStep) {
      case CONTROL_STEP.ADDJUST:
        setControlTooltipInfo({
          addAnother: false,
          saveit: false,
          tutShoot: true,
        });
        setFooterControlBtn({
          image: images.buttonCamera,
          style: styles.cameraImage,
        });
        setFooterLeftBtnImg(images.buttonCancel);
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
      case CONTROL_STEP.PREVIEW:
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
      case CONTROL_STEP.BLEND:
        setControlTooltipInfo({
          addAnother: false,
          saveit: false,
          tutShoot: false,
        });
        setFooterControlBtn(null);
        setFooterRightBtnImg(images.buttonSave);
        setFooterLeftBtnImg(images.buttonBack);
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentControlStep]);

  const {
    isShowCameraPreview,
    isShowOriginImage,
    isShowNewImage,
    isShowOpacitySlider,
    isShowBlendMode,
  } = useMemo(() => {
    let showCameraPreview = false;
    let showOpacitySlider = false;
    let showOriginImage = false;
    let showNewImage = false;
    let showBlendMode = false;

    switch (currentControlStep) {
      case CONTROL_STEP.ADDJUST:
        showCameraPreview = true;
        if (originImage.uri) {
          showOriginImage = true;
          showOpacitySlider = true;
        }
        break;
      case CONTROL_STEP.ROTATE:
        showNewImage = true;
        if (originImage.uri) {
          showOriginImage = true;
        }
        break;
      case CONTROL_STEP.PREVIEW:
        showOriginImage = true;
        showNewImage = true;
        break;
      case CONTROL_STEP.BLEND:
        showBlendMode = true;
        break;
      default:
        break;
    }

    return {
      isShowCameraPreview: showCameraPreview,
      isShowOriginImage: showOriginImage,
      isShowNewImage: showNewImage,
      isShowOpacitySlider: showOpacitySlider,
      isShowBlendMode: showBlendMode,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentControlStep]);

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

  // Event halder for right button in the footer
  const gotoNextStep = useCallback(() => {
    switch (currentControlStep) {
      case CONTROL_STEP.ADDJUST:
        uploadPictureFromGallery();
        break;
      case CONTROL_STEP.ROTATE:
        setPreviewControlStep(currentControlStep);
        if (originImage.uri) {
          setCurrentControlStep(CONTROL_STEP.PREVIEW);
        } else {
          setOriginImage({ ...newImage });
          setNewImage({
            rotate: 0,
            uri: '',
          });
          setCurrentControlStep(CONTROL_STEP.ADDJUST);
        }
        break;
      case CONTROL_STEP.PREVIEW:
        setCurrentControlStep(CONTROL_STEP.BLEND);
        break;
      default:
        break;
    }
  }, [currentControlStep, originImage, newImage]);

  // Event halder for left button in the footer
  const backToPrevStep = useCallback(() => {
    switch (currentControlStep) {
      case CONTROL_STEP.ADDJUST:
        if (previewControlStep === CONTROL_STEP.ROTATE) {
          setCurrentControlStep(previewControlStep);
          setNewImage({ ...originImage });
          setOriginImage({
            rotate: 0,
            uri: '',
          });
        } else if (previewControlStep === CONTROL_STEP.PREVIEW) {
          setCurrentControlStep(previewControlStep);
          setOriginImage(mixedImages[0]);
          setNewImage(mixedImages[1]);
          setMixedImages([]);
        } else {
          props.navigation.navigate('Home');
        }
        break;
      case CONTROL_STEP.ROTATE:
        setCurrentControlStep(CONTROL_STEP.ADDJUST);
        break;
      case CONTROL_STEP.PREVIEW:
        Alert.alert(
          'This will delete your current just-a-pose',
          '',
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
      case CONTROL_STEP.BLEND:
        setCurrentControlStep(CONTROL_STEP.PREVIEW);
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentControlStep, props.navigation]);

  const handleControlBtnClicked = useCallback(() => {
    switch (currentControlStep) {
      case CONTROL_STEP.ADDJUST:
        takePicture();
        break;
      case CONTROL_STEP.ROTATE:
        setNewImage({
          ...newImage,
          rotate: (newImage.rotate + 90) % 360,
        });
        break;
      case CONTROL_STEP.PREVIEW:
        takeScreenShot();
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentControlStep, newImage]);

  // update blend mode
  const updateBlendMode = useCallback((updatedBlendMode) => {
    setBlendMode(updatedBlendMode);
  }, []);

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
      setNewImage({ rotate: 0, uri: data.uri });

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
          setCurrentControlStep(CONTROL_STEP.ROTATE);
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
        setNewImage({ rotate: 0, uri: res.uri });
        setCurrentControlStep(CONTROL_STEP.ROTATE);
      }
    });
  };

  // Delete the current taken pictures
  const deleteCurrentJustapose = () => {
    setOriginImage({
      rotate: 0,
      uri: '',
    });
    setNewImage({
      rotate: 0,
      uri: '',
    });
    setCurrentControlStep(CONTROL_STEP.HOME);
    props.navigation.navigate('Home');
  };

  // Take a screenshot
  const takeScreenShot = () => {
    captureScreen({
      width: deviceWitdh,
      height: deviceHeight,
      // Either png or jpg (or webm Android Only), Defaults: png
      format: 'jpg',
      // Quality 0.0 - 1.0 (only available for jpg)
      quality: 0.8,
    }).then(
      //callback function to get the result URL of the screnshot
      (uri) => {
        // Store two pictures info before mixing
        setMixedImages([originImage, newImage]);

        // Crop a taken screenshot to get only image view
        const cropData = {
          offset: { x: 0, y: 230 },
          size: { width: deviceWitdh * 2, height: deviceWitdh * 2 },
          // // Size to which you want to scale the cropped image
          // displaySize: { width: deviceWitdh, height: deviceWitdh },
          // resizeMode: 'contain' | 'cover' | 'stretch',
        };

        ImageEditor.cropImage(uri, cropData).then(
          (url) => {
            //
            setOriginImage({
              rotate: 0,
              uri: url,
            });
            setNewImage({
              rotate: 0,
              uri: '',
            });

            setPreviewControlStep(currentControlStep);
            setCurrentControlStep(CONTROL_STEP.ADDJUST);
          },
          (error) => console.error('Oops, Something Went Wrong', error),
        );
      },
      (error) => console.error('Oops, Something Went Wrong', error),
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/*   Header   */}
      <Header />

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

        {!isShowBlendMode && (
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

            {isShowNewImage && (
              <View
                style={{
                  ...styles.imagePreviewWrapper,
                  transform: [{ rotate: `${newImage.rotate}deg` }],
                }}>
                {newImage.uri !== '' && (
                  <Image
                    source={{ isStatic: true, uri: newImage.uri }}
                    resizeMode="contain"
                    style={styles.imagePreview}
                  />
                )}
              </View>
            )}

            {isShowOriginImage && (
              <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  marginTop: isShowCameraPreview || isShowNewImage ? -(deviceWitdh + 28) : 0,
                  opacity: originImage.uri ? justOpacity : 1,
                }}>
                {/*   Image Preview   */}
                {originImage.uri !== '' && (
                  <View
                    style={{
                      ...styles.imagePreviewWrapper,
                      transform: [{ rotate: `${originImage.rotate}deg` }],
                    }}>
                    <Image
                      source={{ isStatic: true, uri: originImage.uri }}
                      resizeMode="contain"
                      style={styles.imagePreview}
                    />
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
        )}

        {isShowBlendMode && (
          <View style={styles.imagePreviewWrapper}>
            <MixBlendImagePreview
              originImage={{ ...originImage, opacity: justOpacity }}
              newImage={newImage}
              blendMode={blendMode}
            />
          </View>
        )}
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
            <TouchableOpacity onPress={() => backToPrevStep()}>
              <Image source={footerLeftBtnImg} resizeMode="contain" style={styles.buttonImage} />
            </TouchableOpacity>
          </View>
          {footerControlBtn && (
            <View style={styles.footerBtnWrapper}>
              <TouchableWithoutFeedback onPress={() => handleControlBtnClicked()}>
                <Image source={footerControlBtn.image} resizeMode="contain" style={footerControlBtn.style} />
              </TouchableWithoutFeedback>
            </View>
          )}
          <View style={styles.footerBtnWrapper}>
            <TouchableOpacity onPress={() => gotoNextStep()}>
              <Image source={footerRightBtnImg} resizeMode="contain" style={styles.buttonImage} />
            </TouchableOpacity>
          </View>
        </View>

        {isShowBlendMode && <BlendModesList onBlendModeChanged={updateBlendMode} />}
      </View>
    </SafeAreaView>
  );
}

export default ViewController;
