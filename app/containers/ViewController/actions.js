/*
 *
 * Controller actions
 *
 */

import { ADD_NEW_IMAGE } from './constants';

export function addNewImage(newUri) {
  return {
    type: ADD_NEW_IMAGE,
    uri: newUri,
  };
}
