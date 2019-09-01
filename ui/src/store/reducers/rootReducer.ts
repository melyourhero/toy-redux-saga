import { combineReducers } from 'redux';
import { History } from 'history';
import { connectRouter } from 'connected-react-router';

import pagesReducer from './Pages';

import { AppState } from '../AppState';

export default function createRootReducerFactory(history: History) {
  return combineReducers<AppState>({
    pages: pagesReducer,
    router: connectRouter(history),
  });
}
