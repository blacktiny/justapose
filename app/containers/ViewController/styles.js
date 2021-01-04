import { StyleSheet, Dimensions } from 'react-native';

const deviceWitdh = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const isSmallDevice = deviceHeight < 800;

export const styles = StyleSheet.create({
  screen: {
    position: 'relative',
    width: deviceWitdh,
    height: deviceHeight,
  },

  // Common
  hide: {
    display: 'none',
  },
  show: {
    display: 'flex',
  },

  // Header
  logo: {
    width: deviceWitdh,
  },
  counter: {
    width: deviceWitdh,
  },

  // Content
  content: {
    width: deviceWitdh - 30,
    marginHorizontal: 15,
  },
  cameraControls: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  flashType: {
    width: 20,
    height: 28,
  },
  cameraType: {
    width: 28,
    height: 28,
  },
  cameraPreviewContainer: {
    position: 'relative',
    width: deviceWitdh - 30,
    height: deviceWitdh - 30,
  },
  cameraPreview: {
    width: '100%',
    height: '100%',
  },
  overlayImagePreview: {
    position: 'absolute',
    top: 0,
    width: deviceWitdh - 30,
    height: deviceWitdh - 30,
  },
  imagePreviewWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: deviceWitdh - 30,
    height: deviceWitdh - 30,
  },
  imageBlendPreviewWrapper: {
    position: 'relative',
    width: deviceWitdh - 30,
    height: deviceWitdh - 30,
    marginTop: 30,
  },
  imagePreview: {
    width: deviceWitdh - 30,
    height: deviceWitdh - 30,
  },

  // Taking Picture Animation
  takingPicture: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 2,
  },
  takingPictureGreen: {
    width: deviceWitdh * 1.3,
    height: deviceWitdh * 1.3,
    marginTop: -deviceWitdh * 0.075,
  },
  takingPictureOrange: {
    width: deviceWitdh * 1.3,
    height: deviceWitdh * 1.3,
    marginTop: -deviceWitdh * 0.7,
  },

  // Opacity Slider
  opacitySliderWrapper: {
    width: deviceWitdh - 30,
  },
  adjustTransTip: {
    width: deviceWitdh,
    height: 40,
    marginTop: isSmallDevice ? -40 : -30,
  },
  opacitySliderContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transparencySliderImage: {
    width: 20,
    height: 20,
  },

  // Footer
  footer: {
    width: deviceWitdh,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: isSmallDevice ? 15 : 60,
  },

  // Tip
  addAnotherTip: {
    position: 'absolute',
    bottom: isSmallDevice ? 100 : 115,
    right: 40,
    width: deviceWitdh,
    height: isSmallDevice ? 45 : 50,
  },
  saveitTip: {
    position: 'absolute',
    bottom: isSmallDevice ? 85 : 107,
    right: -10,
    height: isSmallDevice ? 55 : 60,
  },
  shareItTip: {
    position: 'absolute',
    bottom: isSmallDevice ? 90 : 107,
    right: isSmallDevice ? -80 : -60,
    height: isSmallDevice ? 55 : 60,
  },
  tutShootTip: {
    position: 'absolute',
    bottom: isSmallDevice ? 80 : 100,
    right: -50,
    width: deviceWitdh,
    height: isSmallDevice ? 65 : 75,
  },

  // Control Buttons
  btnsGroupWrapper: {
    width: deviceWitdh,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerBtnWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: deviceWitdh / 3,
    height: isSmallDevice ? 90 : 100,
  },
  cameraImage: {
    width: isSmallDevice ? 180 : 200,
    height: isSmallDevice ? 90 : 100,
  },
  rotateImage: {
    width: 40,
    height: 40,
  },
  buttonImage: {
    width: isSmallDevice ? 52 : 57,
    height: isSmallDevice ? 52 : 57,
  },

  // Blend Mode
  blendModeScrollView: {
    width: deviceWitdh,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll',
    backgroundColor: 'lightgrey',
  },
  blendModeList: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 15,
  },
  blendModeImage: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
  underSelectorWrapper: {
    width: '100%',
    height: 10,
    position: 'absolute',
    top: 60,
  },
  underSelector: {
    position: 'absolute',
    top: 0,
    width: 30,
    height: 3,
    backgroundColor: 'grey',
  },

  // Share Modal
  modalContentWrapper: {
    position: 'relative',
    width: deviceWitdh,
    height: deviceHeight * (isSmallDevice ? 0.9 : 0.8),
    paddingTop: isSmallDevice ? 5 : 10,
    borderRadius: 10,
  },
  modalFooter: {
    bottom: isSmallDevice ? 20 : 50,
  },
});
