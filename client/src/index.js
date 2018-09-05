// primary module that ties store actions with reducers

// redux modules
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
// react modules
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import './stylesheets/style.css';
// Import all Created react components that are associated with the router
// standard menu (non-authenticated) components
import AppRouter from './routers/AppRouter';

import 'bootstrap/dist/css/bootstrap.min.css';

// import combined reducer to pass to store here
import reducers from './reducers/index';

// use logger for debugging only
// const middleware = applyMiddleware(thunk,logger)
const middleware = applyMiddleware(thunk, logger);
const store = createStore(reducers, middleware);

const Routes = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);
// render routes
render(Routes, document.getElementById('root'));
