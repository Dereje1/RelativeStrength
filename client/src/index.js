// primary module that ties store actions with reducers

// redux modules
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
// react modules
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
// router
import AppRouter from './routers/AppRouter';

// import combined reducer to pass to store
import reducers from './reducers/index';

// css
import './index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const middleware = applyMiddleware(thunk, logger);
const store = createStore(reducers, middleware);

const Routes = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);
// render routes
render(Routes, document.getElementById('root'));
