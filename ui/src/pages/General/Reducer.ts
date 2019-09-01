import { Action } from 'redux-actions';

import { handleActions } from '../../store/ReduxHelpers';

import { APPLY_NAME } from './Actions';

export interface GeneralState {
  name: string;
}

const initialState: GeneralState = {
  name: 'test',
};

const reducerMap = {
  [APPLY_NAME]: (state: GeneralState, action: Action<string>) => {
    state.name = action.payload;
  },
};

export default handleActions(reducerMap, initialState);
