import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/App';
import {Provider} from 'mobx-react';
import AppState from './src/store/appState';

let appState = new AppState();

ReactDOM.render(
  <Provider appState={appState}>
    <App />
  </Provider>,
  document.getElementById('root')
);