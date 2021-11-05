import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './i18n'
import reportWebVitals from './reportWebVitals';
import { UseWalletProvider } from './use-wallet'
import { ChainIds } from './constants/index';
import i18n from './i18n';
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import { QueryParamProvider } from 'use-query-params';
import { HashRouter } from 'react-router-dom'

const { persistor, store } = configureStore();
i18n.init().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <UseWalletProvider
        connectors={ChainIds}
      >
        <QueryParamProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </QueryParamProvider>
      </UseWalletProvider>
    </Provider>,
    document.getElementById('root')
  );
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
