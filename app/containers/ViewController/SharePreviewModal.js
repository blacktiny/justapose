/**
 *
 * Share Preview Modal
 *
 */

import React from 'react';
import { Image, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Modal from 'react-native-modalbox';

import { CONTROL_STEP, Header } from './index';
import images from 'images';
import { styles } from './styles';

export function SharePreviewModal(props) {
  const { modalVisible, finalImage, onModalClosed } = props;

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
            resizeMode="contain"
            style={{ ...styles.imagePreview, transform: [{ rotate: `${finalImage.rotate}deg` }] }}
          />
        </View>

        {/*   Footer   */}
        <View style={{ ...styles.footer, ...styles.modalFooter }}>
          <Image source={images.shareIt} resizeMode="contain" style={styles.shareItTip} />

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
              <TouchableOpacity onPress={() => {}}>
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
