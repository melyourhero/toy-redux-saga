import { Action, ActionFunction1 } from 'redux-actions';

import { createAction } from '../../store/ReduxHelpers';

export const APPLY_NAME = Symbol('APPLY_NAME');
export const applyName: ActionFunction1<string, Action<string>> = createAction(APPLY_NAME);
