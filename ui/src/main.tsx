import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import 'normalize.css/normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';

import { configureStore } from './store/createStore';

import App from './containers/App';

const store = configureStore();

const renderApp = (Component: React.ComponentClass) => {
  render(
    <Provider store = {store}>
      <Component />
    </Provider>,
    document.getElementById('root'),
  );
};

renderApp(App);
