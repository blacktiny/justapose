import { StyleSheet, Dimensions, Platform } from 'react-native';

const deviceWitdh = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

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
    bottom: 30,
  },
  cameraImage: {
    width: 200,
    height: 100,
  },
});
