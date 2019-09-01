import immer from 'immer';
import { Action } from 'redux';
import { createAction as originalCreateAction, ActionFunctionAny } from 'redux-actions';
import isPlainObject from 'lodash/isPlainObject';

import { TypedObject } from '../utils/GeneralUtils';

const validateActionType = (actionType: any) => {
  if (actionType === 'undefined' || actionType === 'null' || !actionType) {
    throw new Error('Action type should be string or symbol');
  }
};

function ownKeys<T extends object>(object: T): Array<keyof T> {
  if (typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function') {
    return Reflect.ownKeys(object) as any;
  }
  //  tslint:disable-next-line
  console.warn('Reflect.ownKeys is not a method');
  let keys: Array<string | symbol> = Object.getOwnPropertyNames(object);

  if (typeof Object.getOwnPropertySymbols === 'function') {
    keys = keys.concat(Object.getOwnPropertySymbols(object));
  } else {
    //  tslint:disable-next-line
    console.warn('Object.getOwnPropertySymbols is not a method');
  }

  return keys as any;
}

/**
 * @desc custom implementation of redux-actions because original has no Symbol action type support
 * (Actually symbols are overlapping because of toString conversion)
 * https://github.com/reduxactions/redux-actions/blob/master/src/handleActions.js
 */
const handleActionsCreator = (processor: typeof immer) => (reducerMap: TypedObject<any>, initState: any) => {
  if (!isPlainObject(reducerMap)) {
    throw new Error('Expected reducerMap to be a object');
  }
  ownKeys(reducerMap).forEach(validateActionType);
  return (state = initState, action: Action) => {
    return processor(state, (draft: any) => {
      const reducer = reducerMap[action.type];
      if (!reducer) {
        return;
      }
      return reducer(draft, action);
    });
  };
};

export const handleActions = handleActionsCreator(immer);

export const createAction = <Payload, Meta>(
  type: symbol | string,
  payloadCreator?: ActionFunctionAny<Payload>,
  metaCreator?: ActionFunctionAny<Meta>,
): ActionFunctionAny<any> => originalCreateAction(type as any, payloadCreator as any, metaCreator as any);
