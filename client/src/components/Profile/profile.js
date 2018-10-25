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
import './css/profile.css';

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

  findClosedTrades = async (dateRange, limit = false) => {
    this.setState({ loading: true });
    const closedTrades = await getClosedTrades(dateRange, limit);
    this.setState({ closedTrades, loading: false });
  }

  selectDates = (dateRange) => {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const beginMonth = new Date(currentYear, currentMonth, 1);
    switch (dateRange) {
      case 'all':
        this.setState({ dateSelection: dateRange }, () => this.findClosedTrades(0));
        break;
      case 'thismonth':
        this.setState(
          { dateSelection: dateRange },
          () => this.findClosedTrades(Date.parse(beginMonth)),
        );
        break;
      case 'lastten':
        this.setState({ dateSelection: dateRange }, () => this.findClosedTrades(0, 10));
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

  render() {
    if (this.props.user.authenticated && Object.keys(this.props.forexData).length) {
      return (
        <React.Fragment>
          <div className="profile_items">
            <h4 className="profile_header">{`${this.props.user.displayname}`}</h4>
            <div>
              <Button onClick={this.entryModal}>Trade Entry</Button>
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
              </React.Fragment>

              :
              <div className="Loading" />
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
