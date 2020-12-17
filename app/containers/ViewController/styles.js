import { StyleSheet, Dimensions } from 'react-native';

const deviceWitdh = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  screen: {
    position: 'relative',
    width: deviceWitdh,
    height: deviceHeight,
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
    position: 'relative',
    width: deviceWitdh,
    height: 400,
  },
  takingPicture: {
    position: 'absolute',
    display: 'flex',
  },
  takingPictureGreen: {
    width: deviceWitdh,
    height: deviceWitdh,
    marginLeft: -(deviceWitdh + 50),
  },
  takingPictureOrange: {
    width: deviceWitdh,
    height: deviceWitdh,
  },
  cameraPreview: {
    width: deviceWitdh,
    height: 400,
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
    bottom: 40,
  },
  tipImage: {
    width: deviceWitdh,
    height: 60,
    marginLeft: 100,
    marginBottom: -10,
  },
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
  buttonImage: {
    width: 57,
    height: 57,
  },
});
