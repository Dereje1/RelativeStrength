import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// bootstrap
import { Button } from 'reactstrap';
// custom functions
import getUser from '../../actions/authentication';
import TradeEntry from './TradeEntry/entry';

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch =>
  bindActionCreators({
    getUser,
  }, dispatch);
class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showEntry: false,
    };
  }

  componentDidMount() {
    if (!Object.keys(this.props.user).length) this.props.getUser();
  }

  entryModal = () => {
    this.setState({
      showEntry: !this.state.showEntry,
    });
  }

  render() {
    if (this.props.user.authenticated) {
      return (
        <div>
          <h4>{this.props.user.displayname}</h4>;
          <Button onClick={() => window.location.assign('/')}>Back</Button>
          <Button
            onClick={this.entryModal}
          >Trade Entry
          </Button>
          <TradeEntry
            show={this.state.showEntry}
            onToggle={() => this.setState({ showEntry: false })}
            userId={this.props.user.username}
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
