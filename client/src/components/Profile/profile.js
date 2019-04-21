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
import { Button, ButtonGroup } from 'reactstrap';
import './styles/profile.scss';

const mapStateToProps = state => state;
class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showEntry: false,
      openTrades: [],
      closedTrades: [],
      loading: false,
      dateSelection: 'lastten',
    };
  }

  componentDidMount() {
    if (this.props.user.authenticated && Object.keys(this.props.forexData).length) {
      this.pullTradeData();
    }
  }

  componentDidUpdate(prevProps) {
    // on manual refresh of /profile route need to pull trade data again
    const prevFxData = Object.keys(prevProps.forexData).length;
    const currFxData = Object.keys(this.props.forexData).length;
    if (currFxData > prevFxData && this.props.user.authenticated) this.pullTradeData();
  }

  pullTradeData = () => {
    this.findOpenTrades();
    this.findClosedTrades(0, 10);
  }

  findOpenTrades = async () => {
    const openTrades = await getOpenTrades();
    this.setState({ openTrades });
  }

  findClosedTrades = async (minDate, limit = false) => {
    this.setState({ loading: true });
    const closedTrades = await getClosedTrades(minDate, limit);
    this.setState({ closedTrades, loading: false });
  }

  selectDates = (dateSelection) => {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const beginMonth = new Date(currentYear, currentMonth, 1);
    switch (dateSelection) {
      case 'all':
        this.setState({ dateSelection }, () => this.findClosedTrades(0));
        break;
      case 'thismonth':
        this.setState(
          { dateSelection },
          () => this.findClosedTrades(Date.parse(beginMonth)),
        );
        break;
      case 'lastten':
        this.setState({ dateSelection }, () => this.findClosedTrades(0, 10));
        break;
      default:
        break;
    }
  }

  entryModal = () => {
    this.setState({
      showEntry: !this.state.showEntry,
    });
  }

  dateSelector = () =>
    (
      <div className="dateSelection">
        <ButtonGroup>
          <Button
            color={this.state.dateSelection === 'all' ? 'primary' : 'secondary'}
            onClick={() => this.selectDates('all')}
          >All
          </Button>
          <Button
            color={this.state.dateSelection === 'thismonth' ? 'primary' : 'secondary'}
            onClick={() => this.selectDates('thismonth')}
          >This Month
          </Button>
          <Button
            color={this.state.dateSelection === 'lastten' ? 'primary' : 'secondary'}
            onClick={() => this.selectDates('lastten')}
          >Last Ten
          </Button>
        </ButtonGroup>
      </div>
    )

  noTrades = () => (
    !this.state.loading ?
      <React.Fragment>
        <div className="notrades">No Trades Found in Database!</div>
        {this.dateSelector()}
      </React.Fragment>
      :
      <div className="Loading" />
  )

  render() {
    if (this.props.user.authenticated && Object.keys(this.props.forexData).length) {
      return (
        <React.Fragment>
          <hr />
          <div className="profile_items">
            <div className="profile_header">{`${this.props.user.displayname}`}</div>
            <div>
              <Button onClick={this.entryModal}>Trade</Button>
            </div>
          </div>
          <TradeEntry
            show={this.state.showEntry}
            onToggle={() => this.setState({ showEntry: false })}
            userId={this.props.user.username}
            fxLastPrices={this.props.forexData.aws.lastPrices}
            refreshData={() => this.pullTradeData()}
          />
          {
            this.state.openTrades.length ?
              <TradeTable
                trades={this.state.openTrades}
                fxLastPrices={this.props.forexData.aws.lastPrices}
                refreshData={() => this.pullTradeData()}
                open
              />
              :
              null
          }
          <hr />
          {
            this.state.closedTrades.length && !this.state.loading ?
              <React.Fragment>
                <TradeTable
                  trades={this.state.closedTrades}
                  fxLastPrices={this.props.forexData.aws.lastPrices}
                  open={false}
                />
                {this.dateSelector()}
              </React.Fragment>
              :
              this.noTrades()
          }
        </React.Fragment>
      );
    }
    return null;
  }

}

Profile.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  forexData: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default connect(mapStateToProps)(Profile);
