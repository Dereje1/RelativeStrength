import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

import { findGain, getProfits } from '../../../utilitiy/fxcomputations';

import TradeInfo from './tradeInfo';
import './css/records.css';

class TradeRecords extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showTradeDetail: false,
      gainUnits: 'pips',
      tradeDetail: {},
    };
  }

  getGain = (singleTrade) => {
    const {
      symbol, long, entry, exit,
    } = singleTrade;

    const gain = findGain(
      symbol, long, entry[0].price, entry[0].size, this.props.fxLastPrices,
      { closePrice: exit[0].price, closedPipVal: exit[0].pipValue },
    );
    const gainresult = {
      pips: `${gain.pips} pips`,
      dollars: gain.dollars < 0 ? `$(${Math.abs(gain.dollars)})` : `$${gain.dollars}`,
    };
    return [gainresult[this.state.gainUnits], gain.profit];
  }

  getCummulative = () => {
    const cummulative = getProfits(this.props.trades, this.props.fxLastPrices, true);
    return (
      this.state.gainUnits === 'pips' ?
        ` Total Gain = ${cummulative.totalPips} Pips`
        :
        `Total Gain = $${cummulative.totalDollars}`
    );
  }

  formatExitDate = (t) => {
    const entry = moment(t.entry[0].date).format('MMM D');
    const exit = moment(t.exit[0].date).format('MMM D');

    const formattedDate = entry === exit ? moment(t.entry[0].date).format('MMM D') :
      `${moment(t.entry[0].date).format('MMM D')}-${moment(t.exit[0].date).format('D')}`;

    return formattedDate;
  }

  toggleGain = () => {
    if (this.state.gainUnits === 'pips') this.setState({ gainUnits: 'dollars' });
    else this.setState({ gainUnits: 'pips' });
  }

  tableBody = () => {
    const rowValues = this.props.trades.map(t =>
      (
        <tr key={t._id}>
          <th className="symbol">{`${t.symbol} `}
            <FontAwesomeIcon
              className={t.long ? 'directionalArrowUp' : 'directionalArrowDown'}
              icon={t.long ? faArrowUp : faArrowDown}
            />
          </th>
          <th>{this.formatExitDate(t)}</th>
          <th
            className={this.getGain(t)[1] ? 'profit' : 'loss'}
            onClick={this.toggleGain}
          >
            {this.getGain(t)[0]}
          </th>
          <th>
            <FontAwesomeIcon
              className="fas fa-cog"
              icon={faInfoCircle}
              onClick={() => this.modificationModal(t)}
            />
          </th>
        </tr>
      ));
    return <tbody className="opentradesbody">{rowValues}</tbody>;
  }

  modificationModal = (t) => {
    this.setState({
      showTradeDetail: !this.state.showModification,
      tradeDetail: t,
    });
  }
  render() {
    return (
      <Table responsive striped>
        <caption className="opentradescaption">{this.getCummulative()}
        </caption>
        {this.tableBody()}
        <TradeInfo
          show={this.state.showTradeDetail}
          trade={this.state.tradeDetail}
          fxLastPrices={this.props.fxLastPrices}
          onToggle={() => this.setState({ showTradeDetail: false })}
        />
      </Table>
    );
  }

}

TradeRecords.propTypes = {
  trades: PropTypes.arrayOf(PropTypes.any).isRequired,
  fxLastPrices: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default TradeRecords;
