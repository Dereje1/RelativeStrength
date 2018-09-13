import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import './css/management.css';
import { findGain, openTradesCummulative } from '../../../utilitiy/orders';

class TradeManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gainUnits: 'pips',
    };
  }

  getGain = (symbol, long, costBasis, size) => {
    const gain = findGain(symbol, long, costBasis, size, this.props.fxLastPrices);
    const gainresult = {
      pips: `${gain.pips} pips`,
      dollars: gain.dollars < 0 ? `$(${Math.abs(gain.dollars)})` : `$${gain.dollars}`,
    };
    return [gainresult[this.state.gainUnits], gain.profit];
  }

  getCummulative = () => {
    const cummulative = openTradesCummulative(this.props.trades, this.props.fxLastPrices);
    return (
      this.state.gainUnits === 'pips' ?
        ` Total Gain = ${cummulative.totalPips} Pips
         Open Risk = ${cummulative.openRiskPips} Pips`
        :
        `Total Gain = $${cummulative.totalDollars}
        Open Risk = $${cummulative.openRiskDollars}`
    );
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
          <th>{moment(t.entry[0].date).format('MMM D')}</th>
          <th
            className={this.getGain(t.symbol, t.long, t.entry[0].price, t.entry[0].size)[1] ? 'profit' : 'loss'}
            onClick={this.toggleGain}
          >
            {this.getGain(t.symbol, t.long, t.entry[0].price, t.entry[0].size)[0]}
          </th>
          <th>
            <FontAwesomeIcon
              className="fas fa-cog"
              icon={faCog}
              onClick={() => console.log('Hello I\'m a Cog!!')}
            />
          </th>
        </tr>
      ));
    return <tbody className="opentradesbody">{rowValues}</tbody>;
  }
  render() {
    return (
      <Table responsive>
        <caption className="opentradescaption">{this.getCummulative()}
        </caption>
        {this.tableBody()}
      </Table>
    );
  }

}

TradeManagement.propTypes = {
  trades: PropTypes.arrayOf(PropTypes.any).isRequired,
  fxLastPrices: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default TradeManagement;
