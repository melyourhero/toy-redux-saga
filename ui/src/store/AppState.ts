import { RouterState } from 'connected-react-router';

import { PagesState } from './reducers/Pages';

export interface AppState {
  pages: PagesState;
  router: RouterState;
}
