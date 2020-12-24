/*
 *
 * Controller reducer
 *
 */

import produce from 'immer';

import { ADD_NEW_IMAGE } from './constants';

export const initialState = {
  images: [],
};

const ControllerReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADD_NEW_IMAGE:
        draft.images.push(action.uri);
        break;
    }
  });

export default ControllerReducer;
