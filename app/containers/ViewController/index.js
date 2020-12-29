/**
 *
 * View Controller
 *
 */

import React, { createRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, Image, View, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'react-native-image-picker';
import Slider from 'react-native-slider';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';

import BlendModesList, { MIX_BLEND_MODES } from './BlendModesList';
import CameraPreview from './CameraPreview';
import MixBlendImagePreview from './MixBlendImagePreview';
import SharePreviewModal from './SharePreviewModal';
import images from 'images';
import { styles } from './styles';
import { addNewImage } from './actions';

const deviceWitdh = Dimensions.get('window').width;

const galleryDirPath = RNFS.DocumentDirectoryPath + '/justapose/';

export const CONTROL_STEP = {
  HOME: '1-Home',
  ADDJUST: '2-JustAPose',
  ROTATE: '3-Rotate',
  PREVIEW: '4-Preview',
  BLENDANDSAVE: '5-BlendAndSave',
  DONE: '6-Done',
  SHARE: '7-Share',
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
  const emptyImage = {
    rotate: 0,
    transparency: 1,
    uri: '',
  };
  const defaultControlTooltipInfo = {
    addAnother: false,
    saveit: false,
    tutShoot: false,
  };

  // Global
  const [currentControlStep, setCurrentControlStep] = useState(CONTROL_STEP.ADDJUST);
  const [previewControlStep, setPreviewControlStep] = useState(CONTROL_STEP.HOME);
  const [originImage, setOriginImage] = useState({ ...emptyImage });
  const [newImage, setNewImage] = useState({ ...emptyImage });
  const [mixedImage, setMixedImage] = useState({ ...emptyImage });
  const [mixedOriginImages, setMixedOriginImages] = useState([]);
  const [controlTooltipInfo, setControlTooltipInfo] = useState({ ...defaultControlTooltipInfo });
  const [extractImageEnabled, setExtractImageEnabled] = useState(false);
  const [takingPicture, setTakingPicture] = useState(false); // in taking a picture
  const [justOpacity, setJustOpacity] = useState(0.5); //
  // Footer Control Buttons
  const [footerLeftBtnImg, setFooterLeftBtnImg] = useState(images.buttonCancel);
  const [footerControlBtn, setFooterControlBtn] = useState({
    image: images.buttonCamera,
    style: styles.cameraImage,
  });
  const [footerRightBtnImg, setFooterRightBtnImg] = useState(images.buttonUpload);
  const [blendMode, setBlendMode] = useState(MIX_BLEND_MODES[0]); // Blend Mode, default mode = Normal
  const [shareModalVisible, setShareModalVisible] = useState(false); // visibility for `Share Modal`

  let viewShotRef = createRef();

  const dispatch = useDispatch();

  useEffect(() => {
    // check if gallery directory for justapose exists
    RNFS.readDir(galleryDirPath)
      .then((files) => {
        console.log('The folder "justapose" exist.');
      })
      .catch((err) => {
        console.log('err = ', err);

        RNFS.mkdir(galleryDirPath)
          .then(() => {
            console.log('/Documents/justapose directory was created successfully.');
          })
          .catch((error) => {
            console.log('err = ', error);
          });
      });
  }, []);

  useEffect(() => {
    switch (currentControlStep) {
      case CONTROL_STEP.ADDJUST:
        setControlTooltipInfo({
          ...defaultControlTooltipInfo,
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
          image: images.buttonCameraAdd,
          style: styles.cameraImage,
        });
        setFooterRightBtnImg(images.buttonNext);
        setFooterLeftBtnImg(images.buttonHome);
        break;
      case CONTROL_STEP.BLENDANDSAVE:
        setControlTooltipInfo({ ...defaultControlTooltipInfo });
        setFooterControlBtn(null);
        setFooterRightBtnImg(images.buttonSave);
        setFooterLeftBtnImg(images.buttonBack);
        setBlendMode(MIX_BLEND_MODES[0]);
        break;
      case CONTROL_STEP.DONE:
        setControlTooltipInfo({ ...defaultControlTooltipInfo });
        setFooterControlBtn(null);
        setFooterRightBtnImg(images.buttonDone);
        setFooterLeftBtnImg(images.buttonBack);
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentControlStep]);

  useEffect(() => {
    if (extractImageEnabled && mixedImage.uri !== '') {
      saveMixedImage(mixedImage.uri);
      setExtractImageEnabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractImageEnabled, mixedImage]);

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
      case CONTROL_STEP.BLENDANDSAVE:
        showBlendMode = true;
        break;
      case CONTROL_STEP.DONE:
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

  // Event handler for right button in the footer
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
          setNewImage({ ...emptyImage });
          setCurrentControlStep(CONTROL_STEP.ADDJUST);
        }
        break;
      case CONTROL_STEP.PREVIEW:
        setCurrentControlStep(CONTROL_STEP.BLENDANDSAVE);
        break;
      case CONTROL_STEP.BLENDANDSAVE:
        setExtractImageEnabled(true);
        break;
      case CONTROL_STEP.DONE:
        setShareModalVisible(true);
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentControlStep, originImage.uri, newImage]);

  // Event handler for left button in the footer
  const backToPrevStep = useCallback(() => {
    switch (currentControlStep) {
      case CONTROL_STEP.ADDJUST:
        if (previewControlStep === CONTROL_STEP.ROTATE) {
          setCurrentControlStep(previewControlStep);
          setNewImage({ ...originImage });
          setOriginImage({ ...emptyImage });
        } else if (previewControlStep === CONTROL_STEP.PREVIEW) {
          setCurrentControlStep(previewControlStep);
          setOriginImage(mixedOriginImages[0]);
          setNewImage(mixedOriginImages[1]);
          setMixedOriginImages([]);
        } else {
          props.navigation.navigate('ImageGallery');
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
      case CONTROL_STEP.BLENDANDSAVE:
        setCurrentControlStep(CONTROL_STEP.PREVIEW);
        break;
      case CONTROL_STEP.DONE:
        setCurrentControlStep(CONTROL_STEP.PREVIEW);
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentControlStep, props.navigation]);

  // Event handler for camera image button
  const handleControlBtnClicked = useCallback(() => {
    switch (currentControlStep) {
      case CONTROL_STEP.ADDJUST:
        setTakingPicture(true);
        break;
      case CONTROL_STEP.ROTATE:
        setNewImage({
          ...newImage,
          rotate: (newImage.rotate + 90) % 360,
        });
        break;
      case CONTROL_STEP.PREVIEW:
        if (viewShotRef) {
          viewShotRef.capture().then((uri) => {
            if (uri) {
              setMixedOriginImages([originImage, newImage]);
              initializeImages(uri);

              setPreviewControlStep(currentControlStep);
              setCurrentControlStep(CONTROL_STEP.ADDJUST);
            }
          });
        }
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentControlStep, newImage]);

  // Update blend mode
  const updateBlendMode = useCallback((updatedBlendMode) => {
    setBlendMode(updatedBlendMode);
  }, []);

  // Get a picture by camera
  const getPictureByCamera = useCallback((data) => {
    setNewImage({ ...emptyImage, uri: data.uri });
    setTakingPicture(false);
    setCurrentControlStep(CONTROL_STEP.ROTATE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Event handler when the share modal is closed
  const closeShareModal = useCallback(
    (nextStep = '') => {
      if (nextStep === CONTROL_STEP.HOME) {
        props.navigation.navigate('ImageGallery');
      } else if (nextStep === CONTROL_STEP.ADDJUST) {
        initializeImages();
        setPreviewControlStep(CONTROL_STEP.SHARE);
        setCurrentControlStep(CONTROL_STEP.ADDJUST);
      }
      setShareModalVisible(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.navigation],
  );

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
        setNewImage({ ...newImage, uri: res.uri });
        setCurrentControlStep(CONTROL_STEP.ROTATE);
      }
    });
  };

  // Delete the current taken pictures
  const deleteCurrentJustapose = () => {
    initializeImages();
    setCurrentControlStep(CONTROL_STEP.HOME);
    props.navigation.navigate('ImageGallery');
  };

  const initializeImages = (originUri = '', newUri = '') => {
    setOriginImage({
      ...emptyImage,
      uri: originUri,
    });
    setNewImage({
      ...emptyImage,
      uri: newUri,
    });
    setMixedImage({
      ...emptyImage,
      uri: newUri,
    });
  };

  // Save the completed images to redux store
  const saveMixedImage = async (url) => {
    if (url) {
      // get image file name
      const fileName = url.split('/').pop();

      // move image from tmp to /Documents/justapose
      await RNFS.moveFile(url, galleryDirPath + fileName)
        .then(() => {
          setMixedImage({ rotate: 0, uri: galleryDirPath + fileName });
          dispatch(addNewImage(galleryDirPath + fileName));

          Alert.alert('The image was saved successfully.', '', [
            { text: 'OK', onPress: () => setCurrentControlStep(CONTROL_STEP.DONE) },
          ]);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const sliderOptions = {
    minimumTrackTintColor: 'lightgrey',
    maximumTrackTintColor: 'darkgrey',
    style: {
      width: deviceWitdh - 90,
      backgroundColor: 'linear-gradient(#f0f0f0, #0f0f0f)',
      marginHorizontal: 10,
    },
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/*   Header   */}
      <Header />

      {/*   Content   */}
      <View style={styles.content}>
        {!isShowBlendMode && (
          <React.Fragment>
            {/*   Camera Preview   */}
            {isShowCameraPreview && (
              <CameraPreview
                isTakingPicture={takingPicture}
                overlayImage={{ ...originImage, opacity: justOpacity }}
                onSucceed={getPictureByCamera}
              />
            )}

            <ViewShot
              ref={(ref) => {
                if (ref) {
                  viewShotRef = ref;
                }
              }}
              style={{ marginTop: isShowCameraPreview ? 0 : 30 }}
              options={{ format: 'jpg', quality: 0.9 }}>
              {isShowNewImage && (
                <View style={styles.imagePreviewCotainer}>
                  {newImage.uri !== '' && (
                    <Image
                      source={{ isStatic: true, uri: newImage.uri }}
                      resizeMode="cover"
                      style={{ ...styles.imagePreview, transform: [{ rotate: `${newImage.rotate}deg` }] }}
                    />
                  )}
                </View>
              )}

              {isShowOriginImage && (
                <View
                  style={{
                    marginTop: isShowCameraPreview || isShowNewImage ? -(deviceWitdh - 30) : 0,
                    opacity: originImage.uri !== '' ? justOpacity : 1,
                  }}>
                  {/*   Image Preview   */}
                  {originImage.uri !== '' && (
                    <View style={styles.imagePreviewCotainer}>
                      <Image
                        source={{ isStatic: true, uri: originImage.uri }}
                        resizeMode="cover"
                        style={{ ...styles.imagePreview, transform: [{ rotate: `${originImage.rotate}deg` }] }}
                      />
                    </View>
                  )}
                </View>
              )}
            </ViewShot>
          </React.Fragment>
        )}

        {isShowBlendMode && (
          <View style={styles.imageBlendPreviewWrapper}>
            <MixBlendImagePreview
              originImage={{ ...originImage, opacity: justOpacity }}
              newImage={newImage}
              blendMode={blendMode}
              extractImageEnabled={extractImageEnabled}
              onExtractImage={(uri) => {
                setMixedImage({ rotate: 0, uri: uri });
              }}
            />
          </View>
        )}
      </View>

      {isShowOpacitySlider && (
        <View style={styles.opacitySliderWrapper}>
          <Image source={images.adjustTrans} resizeMode="contain" style={styles.adjustTransTip} />
          <View style={styles.opacitySliderContainer}>
            <Image source={images.transparent} resizeMode="contain" style={styles.transparencySliderImage} />
            <Slider value={justOpacity} onValueChange={(value) => setJustOpacity(value)} {...sliderOptions} />
            <Image source={images.opaque} resizeMode="contain" style={styles.transparencySliderImage} />
          </View>
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

      {/*   Share Modal   */}
      <SharePreviewModal
        modalVisible={shareModalVisible}
        finalImage={mixedImage}
        onModalClosed={(nextStep) => closeShareModal(nextStep)}
      />
    </SafeAreaView>
  );
}

export default ViewController;
