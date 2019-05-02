// dumb component to dispaly header bar
import React from 'react';
import PropTypes from 'prop-types';
// Router
import { NavLink, withRouter } from 'react-router-dom';
// font awesome and css
import './styles/navigation.scss';
import googleSignIn from './styles/btn_google_signin_dark_normal_web@2x.png';

const Navigation = ({ authenticated }) => (
  <div className="navigation">
    {
      authenticated
        ? (
          <React.Fragment>
            <NavLink className="navitem" to="/profile">
              {'Profile'}
            </NavLink>
            <NavLink className="navitem" to="/strength">
              {'Strength'}
            </NavLink>
            <a className="navitem" href="auth/logout">
              {'Logout'}
            </a>
          </React.Fragment>
        )
        : (
          <React.Fragment>
            <div
              className="signin"
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
              onClick={() => window.location.assign('auth/google')}
            >
              <img alt="google" src={googleSignIn} className="google" />
            </div>

          </React.Fragment>
        )
    }
  </div>
);


Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};
export default withRouter(Navigation);
