import React from 'react';
import PropTypes from 'prop-types';
import { Well } from 'react-bootstrap';
import './css/header.css';

const Header = ({ secondsSinceUpdate }) => (
  <Well className="header">
    <div className="description">
      <h3 className="title"> Relative Strength of Major Currencies Against the USD</h3>
      {secondsSinceUpdate < -900 ?
        <h4 className="title expired">Requesting Fresh Data...{-1 * (secondsSinceUpdate + 900)}s</h4>
        :
        <h4 className="title valid">Updated {(-1 * secondsSinceUpdate)} Seconds Ago</h4>
      }
    </div>
    <a className="login" href="auth/google">Login</a>
  </Well>
);

Header.defaultProps = {
  secondsSinceUpdate: 0,
};

Header.propTypes = {
  secondsSinceUpdate: PropTypes.number,
};
export default Header;
