import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getProfits } from '../../../utilitiy/fxcomputations';

const TradeDetail = (props) => {
  const {
    entry,
    exit,
  } = props.trade;

  const {
    totalPips,
    totalDollars,
  } = getProfits([props.trade], props.fxLastPrices, true);

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
      <div className="tradedata">
        {
          `Exit Date: ${moment(exit[0].date).format('L')}
        Cost Basis: ${exit[0].price}`
        }
      </div>
      <div className="entrycomments">
        {
          `${exit[0].comments}`
        }
      </div>
      <div className={`gainrisk ${totalDollars > 0 ? 'profitable' : 'loser'}`}>
        {
          `${totalDollars > 0 ? 'Gain:' : 'Loss:'} ${totalPips} Pips, $${totalDollars}`
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
