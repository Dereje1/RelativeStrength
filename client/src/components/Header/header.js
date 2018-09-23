import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import getForexHours from '../../utilitiy/tradehours';
import './css/header.css';

const Header = ({ secondsSinceUpdate, loggedIn }) => (
  <div className="header">
    <div className="description">
      {secondsSinceUpdate < -300 ?
        <div className="Loading fx" />
        :
        null
      }
      {
        <div className="forexHours">
          <div className={`center ${getForexHours('NEWYORK')}`}>New York</div>
          <div className={`center ${getForexHours('LONDON')}`}>London</div>
          <div className={`center ${getForexHours('TOKYO')}`}>Tokyo</div>
          <div className={`center ${getForexHours('SYDNEY')}`}>Sydney</div>
        </div>
      }
    </div>
    {loggedIn ?
      <div className="login">
        <NavLink activeClassName="is-active" to="/profile">
              Profile
        </NavLink>
        <a href="auth/logout">
              Logout
        </a>
      </div>
      :
      <div className="login">
        <a href="auth/google">Login</a>
      </div>
    }
    <hr />
  </div>
);

Header.defaultProps = {
  secondsSinceUpdate: 0,
  loggedIn: false,
};

Header.propTypes = {
  secondsSinceUpdate: PropTypes.number,
  loggedIn: PropTypes.bool,
};
export default withRouter(Header);
