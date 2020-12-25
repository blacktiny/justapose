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

  // Header
  logo: {
    width: deviceWitdh,
  },

  // Content
  imagePreview: {
    width: deviceWitdh - 30,
    height: deviceWitdh - 30,
    marginTop: 50,
    marginHorizontal: 15,
  },
  image: {
    width: '100%',
    height: '100%',
  },

  // Footer
  btnsGroupWrapper: {
    width: deviceWitdh,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
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
  buttonDelete: {
    width: isSmallDevice ? 42 : 44,
    height: isSmallDevice ? 42 : 44,
  },
});
