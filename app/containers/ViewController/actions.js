/*
 *
 * Controller actions
 *
 */

import { ADD_NEW_IMAGE, DELETE_IMAGE, SELECT_IMAGE, UPDATE_CONTROL_IMAGE } from './constants';

export function addNewImage(imageUri) {
  return {
    type: ADD_NEW_IMAGE,
    uri: imageUri,
  };
}

export function deleteImage(imageUri) {
  return {
    type: DELETE_IMAGE,
    uri: imageUri,
  };
}

export function selectImage(imageUri) {
  return {
    type: SELECT_IMAGE,
    uri: imageUri,
  };
}

export function updateControlImage(data) {
  return {
    type: UPDATE_CONTROL_IMAGE,
    data,
  };
}
