import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import './css/header.css';
import Constants from '../../constants/index';

const { MT4_UPDATE_CYCLE } = Constants;

const Header = ({ secondsSinceUpdate, loggedIn, openCenters }) => (
  <div className="header">
    <div className="description">
      {secondsSinceUpdate < MT4_UPDATE_CYCLE ?
        <div className="Loading fx" />
        :
        null
      }
      {
        <div className="forexHours">
          <div className={`center ${openCenters.NEWYORK}`}>New York</div>
          <div className={`center ${openCenters.LONDON}`}>London</div>
          <div className={`center ${openCenters.TOKYO}`}>Tokyo</div>
          <div className={`center ${openCenters.SYDNEY}`}>Sydney</div>
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
  openCenters: PropTypes.objectOf(PropTypes.string).isRequired,
};
export default withRouter(Header);
