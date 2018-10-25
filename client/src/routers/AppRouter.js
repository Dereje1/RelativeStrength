import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

// Our components
import Main from '../main';
import Strength from '../components/Strength/strength';
import Profile from '../components/Profile/profile';
import Footer from '../components/Footer/footer';

const AppRouter = () => (
  <BrowserRouter>
    <React.Fragment>
      <Main />
      <Switch>
        <Route path="/strength" exact component={Strength} />
        <Route path="/profile" exact component={Profile} />
        <Redirect from="/" to="/strength" />
      </Switch>
      <Footer />
    </React.Fragment>
  </BrowserRouter>
);

// AppRouter exports a React component. Thus ReactComponent casing style
export default AppRouter;
