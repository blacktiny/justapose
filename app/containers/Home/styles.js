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
  allPhoto: {
    width: deviceWitdh,
    height: deviceHeight,
  },
  cemeraView: {
    width: deviceWitdh,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: isSmallDevice ? 30 : 60,
  },
  cameraImage: {
    width: 200,
    height: 100,
  },
});
