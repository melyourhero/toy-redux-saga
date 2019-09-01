import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import General from './pages/General/General';

export default (
  <Switch>
    <Route
      component = {General}
      exact = {true}
      path = '/'
    />
  </Switch>
);
