// root of the frontend get /set primary store vars here
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Home from './components/home';

// action gets user info on every mount of this component
import getUser from './actions/authentication';

class Main extends React.Component {

  componentDidMount() {
    console.log('CDM Mounted for Main');
    this.props.getUser();
  }
  render() {
    return <Home />;
  }

}


function mapStateToProps(state) {
  return state;
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getUser,
  }, dispatch);
}

Main.defaultProps = {
  getUser: {},
};

Main.propTypes = {
  getUser: PropTypes.func,
};
export default connect(mapStateToProps, mapDispatchToProps)(Main);
