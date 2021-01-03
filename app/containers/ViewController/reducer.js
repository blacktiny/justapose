/*
 *
 * Controller reducer
 *
 */

import produce from 'immer';

import { ADD_NEW_IMAGE, DELETE_IMAGE, SELECT_IMAGE, UPDATE_CONTROL_IMAGE } from './constants';

const emptyImage = {
  rotate: 0,
  transparency: 1,
  uri: '',
};

export const initialState = {
  images: [],
  selected: '',
  isNew: true,
  originImage: emptyImage,
  newImage: emptyImage,
};

const ControllerReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADD_NEW_IMAGE:
        draft.images.push(action.uri);
        draft.isNew = false;
        break;
      case DELETE_IMAGE:
        const indexOfImage = draft.images.findIndex((image) => image === action.uri);
        draft.images.splice(indexOfImage, 1);
        break;
      case SELECT_IMAGE:
        draft.selected = action.uri;
        break;
      case UPDATE_CONTROL_IMAGE:
        console.log('action = ', action);
        const { image, type } = action.data;
        if (type === 'New') {
          draft.newImage = image;
        } else if (type === 'Origin') {
          draft.originImage = image;
        }
        break;
    }
  });

export default ControllerReducer;
