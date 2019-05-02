// master profile component
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// redux read only
import { connect } from 'react-redux';
// bootstrap and css
import { Button, ButtonGroup } from 'reactstrap';
// custom components
import TradeEntry from './TradeEntry/tradeentry';
import TradeTable from './tradetable';
// api calls
import { getOpenTrades, getClosedTrades } from '../../utilitiy/api';
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
    const { user, forexData } = this.props;
    if (user.authenticated && Object.keys(forexData).length) {
      this.pullTradeData();
    }
  }

  componentDidUpdate(prevProps) {
    // on manual refresh of /profile route need to pull trade data again
    const { user, forexData } = this.props;
    const prevFxData = Object.keys(prevProps.forexData).length;
    const currFxData = Object.keys(forexData).length;
    if (currFxData > prevFxData && user.authenticated) this.pullTradeData();
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
    const { showEntry } = this.state;
    this.setState({
      showEntry: !showEntry,
    });
  }

  dateSelector = () => {
    const { dateSelection } = this.state;
    return (
      <div className="dateSelection">
        <ButtonGroup>
          <Button
            color={dateSelection === 'all' ? 'primary' : 'secondary'}
            onClick={() => this.selectDates('all')}
          >
            {'All'}
          </Button>
          <Button
            color={dateSelection === 'thismonth' ? 'primary' : 'secondary'}
            onClick={() => this.selectDates('thismonth')}
          >
            {'This Month'}
          </Button>
          <Button
            color={dateSelection === 'lastten' ? 'primary' : 'secondary'}
            onClick={() => this.selectDates('lastten')}
          >
            {'Last Ten'}
          </Button>
        </ButtonGroup>
      </div>
    );
  }

  noTrades = () => {
    const { loading } = this.state;
    return (
      !loading
        ? (
          <React.Fragment>
            <div className="notrades">No Trades Found in Database!</div>
            {this.dateSelector()}
          </React.Fragment>
        )
        : <div className="Loading" />
    );
  }

  render() {
    const {
      showEntry, openTrades, closedTrades, loading,
    } = this.state;
    const { user, forexData } = this.props;
    if (user.authenticated && Object.keys(forexData).length) {
      return (
        <React.Fragment>
          <hr />
          <div className="profile_items">
            <div className="profile_header">{`${user.displayname}`}</div>
            <div>
              <Button onClick={this.entryModal}>Trade</Button>
            </div>
          </div>
          <TradeEntry
            show={showEntry}
            onToggle={() => this.setState({ showEntry: false })}
            userId={user.username}
            fxLastPrices={forexData.aws.lastPrices}
            refreshData={() => this.pullTradeData()}
          />
          {
            openTrades.length
              ? (
                <TradeTable
                  trades={openTrades}
                  fxLastPrices={forexData.aws.lastPrices}
                  refreshData={() => this.pullTradeData()}
                  open
                />
              )
              : null
          }
          <hr />
          {
            closedTrades.length && !loading
              ? (
                <React.Fragment>
                  <TradeTable
                    trades={closedTrades}
                    fxLastPrices={forexData.aws.lastPrices}
                    open={false}
                  />
                  {this.dateSelector()}
                </React.Fragment>
              )
              : this.noTrades()
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
