/**
 *
 * Camera Preview
 *
 */

import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, TouchableWithoutFeedback, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

import images from 'images';
import { styles } from './styles';

const deviceWitdh = Dimensions.get('window').width;

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

export function CameraView(props) {
  const { overlayImage = null, isTakingPicture = false, onSucceed } = props;

  const [flashType, setFlashType] = useState(FLASH_TYPE.AUTO);
  const [cameraType, setCameraType] = useState(CAMERA_TYPE.FRONT);
  const [takingPicture, setTakingPicture] = useState(false);

  let cameraEleRef = createRef();

  const slide2LeftAnim = useRef(new Animated.Value(deviceWitdh + 50)).current;
  const slide2RightAnim = useRef(new Animated.Value(-(deviceWitdh + 150))).current;

  useEffect(() => {
    if (isTakingPicture) {
      takePicture();
    }
  }, [isTakingPicture, takePicture]);

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

  // take a picture by camera
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // setNewImage({ rotate: 0, uri: data.uri });

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
          onSucceed(data);
        }, 1000);
      }, 1000);
    }
  };

  return (
    <View>
      {/*   Camera Controls   */}
      <View style={styles.cameraControls}>
        <TouchableWithoutFeedback onPress={changeFlashType}>
          <Image source={FLASH_IMAGES[flashType]} resizeMode="contain" style={styles.flashType} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={changeCameraType}>
          <Image source={images.flip} resizeMode="contain" style={styles.cameraType} />
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.cameraPreviewContainer}>
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

        {overlayImage.uri !== '' && (
          <View
            style={{
              ...styles.overlayImagePreview,
              opacity: overlayImage.opacity,
              transform: [{ rotate: `${overlayImage.rotate}deg` }],
            }}>
            <Image
              source={{ isStatic: true, uri: overlayImage.uri }}
              resizeMode="contain"
              style={styles.imagePreview}
            />
          </View>
        )}

        {/*   Taking a Picture Animation   */}
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
      </View>
    </View>
  );
}

export default CameraView;
