import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// bootstrap
import { Button } from 'reactstrap';
// custom functions
import TradeEntry from './TradeEntry/entry';

const mapStateToProps = state => state;
class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showEntry: false,
    };
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
            fxLastPrices={this.props.forexData.aws.lastPrices}
          />
        </div>
      );
    }
    return window.location.assign('/');
  }

}

Profile.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  forexData: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default connect(mapStateToProps)(Profile);
