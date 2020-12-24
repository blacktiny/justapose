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

  // ScrollView
  scrollView: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
    marginTop: 10,
    backgroundColor: '#cfcfcf',
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: (deviceWitdh - 30) / 2,
    height: (deviceWitdh - 30) / 2,
    margin: 5,
    backgroundColor: '#f1f1f1',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },

  // CameraIamge
  cameraImage: {
    position: 'absolute',
    width: 200,
    height: 100,
    bottom: 50,
    left: (deviceWitdh - 200) / 2,
  },
});
