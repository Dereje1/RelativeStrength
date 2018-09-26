// master profile component
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// redux read only
import { connect } from 'react-redux';
// custom components
import TradeEntry from './TradeEntry/tradeentry';
import TradeTable from './tradetable';
// api calls
import { getOpenTrades, getClosedTrades } from '../../utilitiy/api';
// bootstrap and css
import { Button } from 'reactstrap';
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
              <TradeTable
                trades={this.state.openTrades}
                fxLastPrices={this.props.forexData.aws.lastPrices}
                open
              />
              :
              null
          }
          <hr />
          {
            this.state.closedTrades.length ?
              <TradeTable
                trades={this.state.closedTrades}
                fxLastPrices={this.props.forexData.aws.lastPrices}
                open={false}
              />
              :
              <div className="Loading" />
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
