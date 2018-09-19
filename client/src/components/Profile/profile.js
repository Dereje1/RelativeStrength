import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// bootstrap
import { Button } from 'reactstrap';
// custom functions
import TradeEntry from './TradeEntry/entry';
import TradeManagement from './TradeManagement/management';
import TradeRecords from './TradeRecords/records';

import { getOpenTrades, getClosedTrades } from '../../utilitiy/orders';

import './css/profile.css';

const mapStateToProps = state => state;
class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showEntry: false,
      openTrades: [],
      closedTrades: [],
    };
  }

  componentDidMount() {
    this.findOpenTrades();
    this.findClosedTrades();
  }

  findOpenTrades = async () => {
    const openTrades = await getOpenTrades();
    this.setState({ openTrades });
  }

  findClosedTrades = async () => {
    const closedTrades = await getClosedTrades();
    this.setState({ closedTrades });
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
          <h4 className="profile_header">{`${this.props.user.displayname}`}</h4>
          <hr />
          <div className="profile_items">
            <div>
              <Button onClick={() => window.location.assign('/')}>Back</Button>
            </div>
            <div>
              <Button onClick={this.entryModal}>Trade Entry</Button>
            </div>
          </div>
          <TradeEntry
            show={this.state.showEntry}
            onToggle={() => this.setState({ showEntry: false })}
            userId={this.props.user.username}
            fxLastPrices={this.props.forexData.aws.lastPrices}
          />
          <hr />
          {
            this.state.openTrades.length ?
              <TradeManagement
                trades={this.state.openTrades}
                fxLastPrices={this.props.forexData.aws.lastPrices}
              />
              :
              null
          }
          <hr />
          {
            this.state.closedTrades.length ?
              <TradeRecords
                trades={this.state.closedTrades}
                fxLastPrices={this.props.forexData.aws.lastPrices}
              />
              :
              null
          }
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
