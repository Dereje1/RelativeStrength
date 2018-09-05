import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { Button } from 'reactstrap';
import './css/header.css';

const Header = ({ secondsSinceUpdate, loggedIn }) => (
  <div className="header">
    <div className="description">
      <h3 className="title"> Relative Strength of Major Currencies Against the USD</h3>
      {secondsSinceUpdate < -900 ?
        <h4 className="title expired">Requesting Fresh Data...{-1 * (secondsSinceUpdate + 900)}s</h4>
        :
        <h4 className="title valid">Updated {(-1 * secondsSinceUpdate)} Seconds Ago</h4>
      }
    </div>
    {loggedIn ?
      <div className="login">
        <NavLink activeClassName="is-active" to="/profile">
              Profile
        </NavLink>
        <Button href="auth/logout">Logout</Button>
      </div>
      :
      <div className="login">
        <Button href="auth/google">Login</Button>
      </div>
    }

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
