// builds trade table for both open and closed trades
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// bootstrap, font awesom and css
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle, faArrowUp, faArrowDown, faCog,
} from '@fortawesome/free-solid-svg-icons';
// fx computation utility
import { findGain, costBasis, getProfits } from '../../utilitiy/fxcomputations';
// custom components
import TradeInfo from './TradeRecords/tradeInfo';
import TradeModification from './TradeManagement/trademodification';

class TradeTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showTradeDetail: false, // closed trade modal
      showModification: false, // open trade modal
      gainUnits: 'pips',
      tradeDetail: {}, // trade in focus
    };
  }

    getGain = (singleTrade) => {
      // get single trade profits although can also use cummulative with array as input
      // could refactor/combine if necessary
      const {
        symbol, long, entry, exit,
      } = singleTrade;
      const { open, fxLastPrices } = this.props;
      const { gainUnits } = this.state;
      const basis = costBasis(entry);
      const gain = open
        ? findGain(symbol, long, basis[1], basis[0], fxLastPrices)
        : findGain(
          symbol, long, basis[1], basis[0], fxLastPrices,
          { closePrice: exit[0].price, closedPipVal: exit[0].pipValue },
        );
      const gainresult = {
        pips: `${gain.pips} pips`,
        dollars: gain.dollars < 0 ? `$(${Math.abs(gain.dollars)})` : `$${gain.dollars}`,
      };
      return [gainresult[gainUnits], gain.profit];
    }

    getCummulative = (isopen) => {
      // get cummulative gain/loss of batch
      const { open, fxLastPrices, trades } = this.props;
      const { gainUnits } = this.state;
      const cummulative = open
        ? getProfits(trades, fxLastPrices)
        : getProfits(trades, fxLastPrices, true);
      if (isopen) {
        return gainUnits === 'pips'
          ? ` Total Gain = ${cummulative.totalPips} Pips
          Open Risk = ${cummulative.openRiskPips} Pips`
          : `Total Gain = $${cummulative.totalDollars}
         Open Risk = $${cummulative.openRiskDollars}`;
      }
      return gainUnits === 'pips'
        ? ` Trades = ${cummulative.totalTrades}
          Total Gain = ${cummulative.totalPips} Pips`
        : ` Trades = ${cummulative.totalTrades}
        Total Gain = $${cummulative.totalDollars}
        Win Rate = ${Math.floor((cummulative.numberOfGainers / cummulative.totalTrades) * 100)}%, RR = ${this.computeRR(cummulative)}`;
    }

    computeRR = (cummulative) => {
      const {
        numberOfGainers, numberOfLoosers, gainTotal, lossTotal,
      } = cummulative;
      const aveWinner = gainTotal / numberOfGainers;
      const aveLooser = (lossTotal / numberOfLoosers) * -1;
      return Math.round((aveWinner / aveLooser) * 100) / 100;
    }

    formatExitDate = (t) => {
      // date range formatting for closed trades
      const entry = moment(t.entry[0].date).format('MMM D');
      const exit = moment(t.exit[0].date).format('MMM D');

      const formattedDate = entry === exit
        ? moment(t.entry[0].date).format('MMM D')
        : `${moment(t.entry[0].date).format('MMM D')}-${moment(t.exit[0].date).format('D')}`;

      return formattedDate;
    }

    toggleGain = () => {
      const { gainUnits } = this.state;
      if (gainUnits === 'pips') this.setState({ gainUnits: 'dollars' });
      else this.setState({ gainUnits: 'pips' });
    }

    tableBody = () => {
      const { trades, open } = this.props;
      /* Symbol(long|SHort) | entry date/trade date range | gain | settings/info */
      const rowValues = trades.map(t => (
        <tr key={t._id}>
          <th className="symbol">
            {`${t.symbol} `}
            <FontAwesomeIcon
              className={t.long ? 'directionalArrowUp' : 'directionalArrowDown'}
              icon={t.long ? faArrowUp : faArrowDown}
            />
          </th>
          <th>
            {
              open
                ? moment(t.entry[0].date).format('MMM D')
                : this.formatExitDate(t)
            }
          </th>
          <th
            className={this.getGain(t)[1] ? 'profit' : 'loss'}
            onClick={this.toggleGain}
          >
            {this.getGain(t)[0]}
          </th>
          <th>
            {
              open
                ? (
                  <FontAwesomeIcon
                    className="fas fa-cog"
                    icon={faCog}
                    onClick={() => this.modificationModal(t)}
                  />
                )
                : (
                  <FontAwesomeIcon
                    className={t.entry.length > 1 ? 'addedposition' : ''}
                    icon={faInfoCircle}
                    onClick={() => this.infoModal(t)}
                  />
                )}
          </th>
        </tr>
      ));
      return <tbody className="opentradesbody">{rowValues}</tbody>;
    }

    infoModal = (t) => {
      const { showTradeDetail } = this.state;
      this.setState({
        showTradeDetail: !showTradeDetail,
        tradeDetail: t,
      });
    }

    modificationModal = (t) => {
      const { showModification } = this.state;
      this.setState({
        showModification: !showModification,
        tradeDetail: t,
      });
    }

    tableType = () => (
      // eslint-disable-next-line react/destructuring-assignment
      this.props.open
        ? { responsive: true, striped: false }
        : { responsive: true, striped: true }
    )

    render() {
      const { open, fxLastPrices, refreshData } = this.props;
      const { showTradeDetail, tradeDetail, showModification } = this.state;
      return (
        <Table {...this.tableType()}>
          <caption className="tradetablecaption">
            <span className="displaytext">{this.getCummulative(open)}</span>
          </caption>
          {this.tableBody()}
          <TradeInfo
            show={showTradeDetail}
            trade={tradeDetail}
            fxLastPrices={fxLastPrices}
            onToggle={() => this.setState({ showTradeDetail: false })}
          />
          <TradeModification
            show={showModification}
            trade={tradeDetail}
            fxLastPrices={fxLastPrices}
            onToggle={() => this.setState({ showModification: false })}
            refreshData={() => refreshData()}
          />
        </Table>
      );
    }

}

TradeTable.defaultProps = {
  refreshData: null,
};

TradeTable.propTypes = {
  trades: PropTypes.arrayOf(PropTypes.any).isRequired,
  fxLastPrices: PropTypes.objectOf(PropTypes.any).isRequired,
  open: PropTypes.bool.isRequired,
  refreshData: PropTypes.func,
};

export default TradeTable;
