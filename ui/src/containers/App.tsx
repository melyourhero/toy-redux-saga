import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { ConnectedRouter } from 'connected-react-router';

import { history } from '../store/createStore';

import routes from '../routes';

class App extends React.Component {
  public render() {
    return (
      <div>
        <ConnectedRouter history = {history}>
          <React.Fragment>
            {routes}
          </React.Fragment>
        </ConnectedRouter>
      </div>
    );
  }
}

export default hot(App);
