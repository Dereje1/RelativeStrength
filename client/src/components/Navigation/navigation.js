// dumb component to dispaly header bar
import React from 'react';
import PropTypes from 'prop-types';
// Router
import { NavLink, withRouter } from 'react-router-dom';
// font awesome and css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
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
        <button className="signin" onClick={() => window.location.assign('auth/google')}>
          <FontAwesomeIcon
            icon={faGooglePlusG}
            className="login"
          />
          <span className="signinfont">Sign In With Google</span>
        </button>

      </React.Fragment>
    }
  </div>
);


Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};
export default withRouter(Navigation);
