import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// react dates below
import { SingleDatePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

// custom functions
import getUser from '../../actions/authentication';

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch =>
  bindActionCreators({
    getUser,
  }, dispatch);
class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = { };
  }

  componentDidMount() {
    if (!Object.keys(this.props.user).length) this.props.getUser();
  }
  render() {
    if (this.props.user.authenticated) {
      return (
        <div>
          <h4>{this.props.user.displayname}</h4>;
          <SingleDatePicker
            date={this.state.date} // momentPropTypes.momentObj or null
            onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
            focused={this.state.focused} // PropTypes.bool
            onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
            id="your_unique_id"
          />
        </div>
      );
    }
    return null;
  }

}

Profile.defaultProps = {
  getUser: {},
  user: {},
};

Profile.propTypes = {
  getUser: PropTypes.func,
  user: PropTypes.objectOf(PropTypes.any),
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
