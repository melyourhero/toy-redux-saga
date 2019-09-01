import { call, take } from '../modules/redux-saga';

import { APPLY_NAME, applyName } from '../pages/General/Actions';

export function* rootSaga() {
  while (true) {
    const action = yield take(APPLY_NAME);
    yield call((payload: string) => console.log(payload), 'Test name');
    console.log('Action: ', action);
  }
}
