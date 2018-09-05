import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Our components
import Main from '../main';
import Profile from '../components/Profile/profile';

const AppRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Main} />
      <Route path="/profile" exact component={Profile} />
    </Switch>
  </BrowserRouter>
);

// AppRouter exports a React component. Thus ReactComponent casing style
export default AppRouter;
