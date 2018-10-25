// dumb component to dispaly header bar
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
// redux read only
import './css/navigation.css';

const Navigation = ({ authenticated }) => (
  <div className="navigation">
    {authenticated ?
      <React.Fragment>
        <div className="login">
          <NavLink to="/profile">
            Profile
          </NavLink>
          <NavLink to="/strength">
            Strength
          </NavLink>
          <a href="auth/logout">
            Logout
          </a>
        </div>
        <hr />
      </React.Fragment>
      :
      <React.Fragment>
        <div className="login">
          <a href="auth/google">Login</a>
        </div>
        <hr />
      </React.Fragment>
    }
  </div>
);


Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};
export default withRouter(Navigation);
