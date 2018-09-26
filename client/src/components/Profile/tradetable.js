// builds trade table for both open and closed trades
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// fx computation utility
import { findGain, getProfits } from '../../utilitiy/fxcomputations';
// custom components
import TradeInfo from './TradeRecords/tradeInfo';
import TradeModification from './TradeManagement/trademodification';
// bootstrap, font awesom and css
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faArrowUp, faArrowDown, faCog } from '@fortawesome/free-solid-svg-icons';


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

      const gain = this.props.open ?
        findGain(symbol, long, entry[0].price, entry[0].size, this.props.fxLastPrices)
        :
        findGain(
          symbol, long, entry[0].price, entry[0].size, this.props.fxLastPrices,
          { closePrice: exit[0].price, closedPipVal: exit[0].pipValue },
        );
      const gainresult = {
        pips: `${gain.pips} pips`,
        dollars: gain.dollars < 0 ? `$(${Math.abs(gain.dollars)})` : `$${gain.dollars}`,
      };
      return [gainresult[this.state.gainUnits], gain.profit];
    }

    getCummulative = (isopen) => {
      // gcet cummulative gain/loss of batch
      const cummulative = this.props.open ?
        getProfits(this.props.trades, this.props.fxLastPrices)
        :
        getProfits(this.props.trades, this.props.fxLastPrices, true);
      if (isopen) {
        return this.state.gainUnits === 'pips' ?
          ` Total Gain = ${cummulative.totalPips} Pips
          Open Risk = ${cummulative.openRiskPips} Pips`
          :
          `Total Gain = $${cummulative.totalDollars}
         Open Risk = $${cummulative.openRiskDollars}`;
      }
      return this.state.gainUnits === 'pips' ?
        ` Total Gain = ${cummulative.totalPips} Pips`
        :
        `Total Gain = $${cummulative.totalDollars}`;
    }

    formatExitDate = (t) => {
      // date range formatting for closed trades
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
      /* Symbol(long|SHort) | entry date/trade date range | gain | settings/info */
      const rowValues = this.props.trades.map(t =>
        (
          <tr key={t._id}>
            <th className="symbol">{`${t.symbol} `}
              <FontAwesomeIcon
                className={t.long ? 'directionalArrowUp' : 'directionalArrowDown'}
                icon={t.long ? faArrowUp : faArrowDown}
              />
            </th>
            <th>
              {
                this.props.open ?
                  moment(t.entry[0].date).format('MMM D')
                  :
                  this.formatExitDate(t)
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
                this.props.open ?
                  <FontAwesomeIcon
                    className="fas fa-cog"
                    icon={faCog}
                    onClick={() => this.modificationModal(t)}
                  />
                  :
                  <FontAwesomeIcon
                    className="fas fa-info-circle"
                    icon={faInfoCircle}
                    onClick={() => this.infoModal(t)}
                  />
              }
            </th>
          </tr>
        ));
      return <tbody className="opentradesbody">{rowValues}</tbody>;
    }

    infoModal = (t) => {
      this.setState({
        showTradeDetail: !this.state.showTradeDetail,
        tradeDetail: t,
      });
    }

    modificationModal = (t) => {
      this.setState({
        showModification: !this.state.showModification,
        tradeDetail: t,
      });
    }

    tableType = () => (this.props.open ?
      { responsive: true, striped: false }
      :
      { responsive: true, striped: true })

    render() {
      return (
        <Table {...this.tableType()}>
          <caption className="opentradescaption">{this.getCummulative(this.props.open)}
          </caption>
          {this.tableBody()}
          <TradeInfo
            show={this.state.showTradeDetail}
            trade={this.state.tradeDetail}
            fxLastPrices={this.props.fxLastPrices}
            onToggle={() => this.setState({ showTradeDetail: false })}
          />
          <TradeModification
            show={this.state.showModification}
            trade={this.state.tradeDetail}
            fxLastPrices={this.props.fxLastPrices}
            onToggle={() => this.setState({ showModification: false })}
          />
        </Table>
      );
    }

}

TradeTable.propTypes = {
  trades: PropTypes.arrayOf(PropTypes.any).isRequired,
  fxLastPrices: PropTypes.objectOf(PropTypes.any).isRequired,
  open: PropTypes.bool.isRequired,
};

export default TradeTable;
