/*
 *
 * Controller reducer
 *
 */

import produce from 'immer';

import { ADD_NEW_IMAGE, DELETE_IMAGE, SELECT_IMAGE } from './constants';

export const initialState = {
  images: [],
  selected: '',
};

const ControllerReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADD_NEW_IMAGE:
        draft.images.push(action.uri);
        break;
      case DELETE_IMAGE:
        const indexOfImage = draft.images.findIndex((image) => image === action.uri);
        draft.images.splice(indexOfImage, 1);
        break;
      case SELECT_IMAGE:
        draft.selected = action.uri;
        break;
    }
  });

export default ControllerReducer;
