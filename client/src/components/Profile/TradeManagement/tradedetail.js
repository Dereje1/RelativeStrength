import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { openTradesCummulative } from '../../../utilitiy/orders';

const TradeDetail = (props) => {
  const {
    stop,
    entry,
  } = props.trade;

  const {
    totalPips,
    totalDollars,
    openRiskPips,
    openRiskDollars,
  } = openTradesCummulative([props.trade], props.fxLastPrices);

  return (
    <div className="tradedetail">
      <div className="tradedata">
        {
          `Entry Date: ${moment(entry[0].date).format('L')}
          Cost Basis: ${entry[0].price}
          Position Size: ${entry[0].size}`
        }
      </div>
      <div className="entrycomments">
        {
          `${entry[0].comments}`
        }
      </div>
      <div className={`gainrisk ${totalDollars > 0 ? 'profitable' : 'loser'}`}>
        {
          `Stop: ${stop}
          Gain: ${totalPips} Pips, $${totalDollars}
          Open Risk: ${openRiskPips} Pips, $${openRiskDollars}`
        }
      </div>
    </div>
  );
};

TradeDetail.propTypes = {
  trade: PropTypes.objectOf(PropTypes.any).isRequired,
  fxLastPrices: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default TradeDetail;
