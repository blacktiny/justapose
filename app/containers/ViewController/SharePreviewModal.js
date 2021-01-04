/**
 *
 * Share Preview Modal
 *
 */

import React, { useCallback } from 'react';
import { Image, Share, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Modal from 'react-native-modalbox';

import { CONTROL_STEP, Header } from './index';
import images from 'images';
import { styles } from './styles';

export function SharePreviewModal(props) {
  const { isNew, modalVisible, finalImage, onModalClosed } = props;

  const onShare = useCallback(async () => {
    try {
      const result = await Share.share({
        message: 'Share a picture',
        url: finalImage.uri,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('activityType = ', result.activityType);
        }
      }
    } catch (error) {
      console.log('error = ', error);
    }
  }, [finalImage.uri]);

  return (
    <Modal
      animationDuration={800}
      isOpen={modalVisible}
      onClosed={() => onModalClosed()}
      style={styles.modalContentWrapper}
      swipeToClose={true}
      position={'bottom'}>
      <View style={styles.modalContentWrapper}>
        {/*   Header   */}
        <Header />

        <View style={styles.content}>
          <Image
            source={{ isStatic: true, uri: finalImage.uri }}
            resizeMode="cover"
            style={{ ...styles.imagePreview, transform: [{ rotate: `${finalImage.rotate}deg` }] }}
          />
        </View>

        {/*   Footer   */}
        <View style={{ ...styles.footer, ...styles.modalFooter }}>
          {isNew && <Image source={images.shareIt} resizeMode="contain" style={styles.shareItTip} />}

          {/*   Control Buttons   */}
          <View style={styles.btnsGroupWrapper}>
            <View style={styles.footerBtnWrapper}>
              <TouchableOpacity onPress={() => onModalClosed(CONTROL_STEP.HOME)}>
                <Image source={images.buttonHome} resizeMode="contain" style={styles.buttonImage} />
              </TouchableOpacity>
            </View>
            <View style={styles.footerBtnWrapper}>
              <TouchableWithoutFeedback onPress={() => onModalClosed(CONTROL_STEP.ADDJUST)}>
                <Image source={images.buttonCamera} resizeMode="contain" style={styles.cameraImage} />
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.footerBtnWrapper}>
              <TouchableOpacity onPress={() => onShare()}>
                <Image source={images.buttonShare} resizeMode="contain" style={styles.buttonImage} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default SharePreviewModal;
