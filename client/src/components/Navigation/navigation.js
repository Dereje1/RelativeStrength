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
        <NavLink className="navitem" to="/profile">
             Profile
        </NavLink>
        <NavLink className="navitem" to="/strength">
             Strength
        </NavLink>
        <a className="navitem" href="auth/logout">
             Logout
        </a>
      </React.Fragment>
      :
      <React.Fragment>
        <a className="navitem" href="auth/google">Login</a>
      </React.Fragment>
    }
  </div>
);


Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};
export default withRouter(Navigation);
