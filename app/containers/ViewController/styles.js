import { StyleSheet, Dimensions } from 'react-native';

const deviceWitdh = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

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
  cameraPreviewWrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: deviceWitdh,
    height: deviceWitdh,
  },
  cameraPreviewContainer: {
    position: 'relative',
    width: deviceWitdh,
    height: deviceWitdh,
    marginTop: 'auto',
  },
  cameraPreview: {
    width: '100%',
    height: '100%',
  },
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
  imagePreviewWrapper: {
    width: deviceWitdh,
    height: deviceWitdh,
    marginTop: 30,
  },
  imagePreview: {
    width: deviceWitdh,
    height: deviceWitdh,
  },

  // Opacity Slider
  opacitySliderContainer: {
    width: deviceWitdh - 30,
    marginLeft: 15,
    marginRight: 15,
  },
  adjustTransTip: {
    width: deviceWitdh,
    height: 40,
    marginTop: -20,
  },

  // Footer
  footer: {
    width: deviceWitdh,
    height: 150,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
  },
  // Tip
  addAnotherTip: {
    width: deviceWitdh,
    height: 50,
    marginLeft: -deviceWitdh * 0.2,
  },
  saveitTip: {
    height: 60,
    marginLeft: deviceWitdh * 0.6,
    marginTop: -50,
    marginBottom: -10,
  },
  tutShootTip: {
    width: deviceWitdh,
    height: 60,
    marginLeft: 100,
    marginBottom: -10,
  },
  // Control Buttons
  btnsGroupWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerBtnWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: deviceWitdh / 3,
    height: '100%',
  },
  cameraImage: {
    width: 200,
    height: 100,
  },
  rotateImage: {
    width: 40,
    height: 40,
  },
  buttonImage: {
    width: 57,
    height: 57,
  },
});
