import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Our components
import Main from '../main';

const AppRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Main} />
    </Switch>
  </BrowserRouter>
);

// AppRouter exports a React component. Thus ReactComponent casing style
export default AppRouter;
