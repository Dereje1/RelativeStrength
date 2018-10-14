// dumb component to dispaly header bar
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter, Redirect } from 'react-router-dom';
import './css/header.css';
import Constants from '../../constants/index';
import Strength from '../Strength/strength';

const { MT4_UPDATE_CYCLE } = Constants;

const Header = ({
  secondsSinceUpdate, loggedIn, openCenters, newLogin, resetNewLogin,
}) => (
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
      <React.Fragment>
        <div className="login">
          <NavLink activeClassName="is-active" to="/profile">
            Profile
          </NavLink>
          <NavLink activeClassName="is-active" to="/strength">
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
        <Strength />
      </React.Fragment>
    }
    {newLogin ? <Redirect to="/strength" /> : null }
    {newLogin ? resetNewLogin() : null }
  </div>
);


Header.propTypes = {
  secondsSinceUpdate: PropTypes.number.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  openCenters: PropTypes.objectOf(PropTypes.string).isRequired,
  newLogin: PropTypes.bool.isRequired,
  resetNewLogin: PropTypes.func.isRequired,
};
export default withRouter(Header);
