/**
 *
 * View Controller
 *
 */

import React, { createRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, Image, View, TouchableWithoutFeedback, SafeAreaView, Text } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'react-native-image-picker';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';

import BlendModesList, { MIX_BLEND_MODES } from './BlendModesList';
import CameraPreview from './CameraPreview';
import ImagePreview from './ImagePreview';
import MixBlendImagePreview from './MixBlendImagePreview';
import SharePreviewModal from './SharePreviewModal';
import images from 'images';
import { styles } from './styles';
import { addNewImage, updateControlImage } from './actions';

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
  const [mixedImage, setMixedImage] = useState({ ...emptyImage });
  const [mixedOriginImages, setMixedOriginImages] = useState([]);
  const [controlTooltipInfo, setControlTooltipInfo] = useState({ ...defaultControlTooltipInfo });
  const [extractMixedImageEnabled, setExtractMixedImageEnabled] = useState(false);
  const [extractNewImageEnabled, setExtractNewImageEnabled] = useState(false);
  const [extractNewImageFinished, setExtractNewImageFinished] = useState(false);
  const [extractOriginImageEnabled, setExtractOriginImageEnabled] = useState(false);
  const [extractOriginImageFinished, setExtractOriginImageFinished] = useState(false);
  const [takingPicture, setTakingPicture] = useState(false); // in taking a picture
  const [newImageEditable, setNewImageEditable] = useState(false); //
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

  const isNew = useSelector((state) => state.controller.isNew); // If an user is first at this app, default is true
  const newImage = useSelector((state) => state.controller.newImage); //
  const originImage = useSelector((state) => state.controller.originImage); //

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

    initializeImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (extractMixedImageEnabled && mixedImage.uri !== '') {
      saveMixedImage(mixedImage.uri);
      setExtractMixedImageEnabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractMixedImageEnabled, mixedImage]);

  useEffect(() => {
    if (extractNewImageEnabled || extractOriginImageEnabled) {
      if (
        ((extractNewImageEnabled && extractNewImageFinished) ||
          (!extractNewImageEnabled && !extractNewImageFinished)) &&
        ((extractOriginImageEnabled && extractOriginImageFinished) ||
          (!extractOriginImageEnabled && !extractOriginImageFinished))
      ) {
        switch (currentControlStep) {
          case CONTROL_STEP.ADDJUST:
            break;
          case CONTROL_STEP.ROTATE:
            if (!originImage.uri) {
              dispatch(
                updateControlImage({
                  image: { ...newImage },
                  type: 'Origin',
                }),
              );
              dispatch(
                updateControlImage({
                  image: { ...emptyImage },
                  type: 'New',
                }),
              );
              setCurrentControlStep(CONTROL_STEP.ADDJUST);
            } else {
              setCurrentControlStep(CONTROL_STEP.PREVIEW);
            }
            break;
        }
        setExtractNewImageEnabled(false);
        setExtractNewImageFinished(false);
        setExtractOriginImageEnabled(false);
        setExtractOriginImageFinished(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractNewImageEnabled, extractNewImageFinished, extractOriginImageEnabled, extractOriginImageFinished]);

  const { isShowCameraPreview, isShowOriginImage, isShowNewImage, isShowBlendMode, isShowCheckbox } = useMemo(() => {
    let showCameraPreview = false;
    let showOriginImage = false;
    let showNewImage = false;
    let showBlendMode = false;

    switch (currentControlStep) {
      case CONTROL_STEP.ADDJUST:
        showCameraPreview = true;
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
      isShowBlendMode: showBlendMode,
      isShowCheckbox: showNewImage && showOriginImage && currentControlStep === CONTROL_STEP.ROTATE,
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
        setExtractNewImageEnabled(true);
        if (originImage.uri) {
          setExtractOriginImageEnabled(true);
        }
        break;
      case CONTROL_STEP.PREVIEW:
        setCurrentControlStep(CONTROL_STEP.BLENDANDSAVE);
        break;
      case CONTROL_STEP.BLENDANDSAVE:
        setExtractMixedImageEnabled(true);
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
          dispatch(updateControlImage({ image: { ...originImage }, type: 'New' }));
          dispatch(updateControlImage({ image: { ...emptyImage }, type: 'Origin' }));
        } else if (previewControlStep === CONTROL_STEP.PREVIEW) {
          setCurrentControlStep(previewControlStep);
          dispatch(updateControlImage({ image: { ...mixedOriginImages[1] }, type: 'New' }));
          dispatch(updateControlImage({ image: { ...mixedOriginImages[0] }, type: 'Origin' }));
          setMixedOriginImages([]);
        } else {
          props.navigation.navigate('ImageGallery');
        }
        break;
      case CONTROL_STEP.ROTATE:
        dispatch(updateControlImage({ image: { ...emptyImage }, type: 'New' }));
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
        dispatch(updateControlImage({ image: { ...newImage, rotate: (newImage.rotate + 90) % 360 }, type: 'New' }));
        break;
      case CONTROL_STEP.PREVIEW:
        if (viewShotRef) {
          viewShotRef.capture().then((uri) => {
            if (uri) {
              setMixedOriginImages([{ ...originImage }, { ...newImage }]);
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
  const getPictureByCamera = useCallback(() => {
    setTakingPicture(false);
    setCurrentControlStep(CONTROL_STEP.ROTATE);
  }, []);

  // Event handler when the share modal is closed
  const closeShareModal = useCallback(
    (nextStep = '') => {
      if (nextStep === CONTROL_STEP.HOME) {
        initializeImages();
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
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
      } else {
        dispatch(updateControlImage({ image: { ...newImage, uri: res.uri }, type: 'New' }));
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
    dispatch(updateControlImage({ image: { ...emptyImage, uri: originUri }, type: 'Origin' }));
    dispatch(updateControlImage({ image: { ...emptyImage, uri: newUri }, type: 'New' }));
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

  return (
    <SafeAreaView style={styles.screen}>
      {/*   Header   */}
      <Header />

      {/*   Content   */}
      <View style={styles.content}>
        {!isShowBlendMode && (
          <React.Fragment>
            {/*   Camera Preview   */}
            {isShowCameraPreview && <CameraPreview isTakingPicture={takingPicture} onSucceed={getPictureByCamera} />}

            {/*   Checkbox   */}
            {isShowCheckbox && (
              <View style={styles.checkboxWrapper}>
                <CheckBox
                  boxType={'square'}
                  disabled={false}
                  lineWidth={1}
                  value={newImageEditable}
                  onValueChange={(newValue) => setNewImageEditable(newValue)}
                  style={styles.checkbox}
                />
                <Text>{'Edit a bottom image'}</Text>
              </View>
            )}

            {/*   Image Preview   */}
            <ViewShot
              ref={(ref) => {
                if (ref) {
                  viewShotRef = ref;
                }
              }}
              style={{ marginTop: isShowCameraPreview ? 0 : isShowCheckbox ? 10 : 30 }}
              options={{ format: 'jpg', quality: 0.9 }}>
              {/*   Bottom Image Preview   */}
              {isShowOriginImage && (
                <ImagePreview
                  sourceType={'Origin'}
                  transparentEnabled={originImage.uri !== '' && !isShowNewImage}
                  zoomEnabled={currentControlStep < CONTROL_STEP.PREVIEW}
                  extractImageEnabled={extractOriginImageEnabled}
                  extractFinished={() => setExtractOriginImageFinished(true)}
                />
              )}

              {isShowNewImage && (
                <View
                  style={{
                    display: newImageEditable ? 'none' : 'flex',
                    marginTop: isShowCameraPreview || isShowOriginImage ? -(deviceWitdh - 30) : 0,
                  }}>
                  {/*   Top Image Preview   */}
                  <ImagePreview
                    sourceType={'New'}
                    transparentEnabled={currentControlStep < CONTROL_STEP.PREVIEW}
                    extractImageEnabled={extractNewImageEnabled}
                    extractFinished={() => setExtractNewImageFinished(true)}
                  />
                </View>
              )}
            </ViewShot>
          </React.Fragment>
        )}

        {isShowBlendMode && (
          <View style={styles.imageBlendPreviewWrapper}>
            <MixBlendImagePreview
              originImage={originImage}
              newImage={newImage}
              blendMode={blendMode}
              extractImageEnabled={extractMixedImageEnabled}
              onExtractImage={(uri) => {
                setMixedImage({ rotate: 0, uri: uri });
              }}
            />
          </View>
        )}
      </View>

      {/*   Footer   */}
      <View style={styles.footer}>
        {/*   Control Tip Images   */}
        {isNew && (
          <React.Fragment>
            {controlTooltipInfo.addAnother && (
              <Image source={images.addAnother} resizeMode="contain" style={styles.addAnotherTip} />
            )}
            {controlTooltipInfo.saveit && (
              <Image source={images.saveit} resizeMode="contain" style={styles.saveitTip} />
            )}
            {controlTooltipInfo.tutShoot && (
              <Image source={images.tutShoot} resizeMode="contain" style={styles.tutShootTip} />
            )}
          </React.Fragment>
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
        isNew={isNew}
        modalVisible={shareModalVisible}
        finalImage={mixedImage}
        onModalClosed={(nextStep) => closeShareModal(nextStep)}
      />
    </SafeAreaView>
  );
}

export default ViewController;
