import { combineReducers } from 'redux';

import generalPageReducer, { GeneralState } from '../../pages/General/Reducer';

export interface PagesState {
  general: GeneralState;
}

export default combineReducers<PagesState>({
  general: generalPageReducer,
});
