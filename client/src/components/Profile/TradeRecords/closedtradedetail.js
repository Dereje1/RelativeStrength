// dumb component displays closed trade information
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getProfits, costBasis } from '../../../utilitiy/fxcomputations';

const generateEntryComments = (entryArr) => {
  if (entryArr.length === 1) return `${entryArr[0].comments}`;
  const myParser = entryArr.map((entry) => {
    const positionInfo = `${moment(entry.date).format('L')} +${entry.size} @${entry.price}`;
    return (
      <React.Fragment key={entry._id}>
        <div className="positionadded">{positionInfo}</div>
        <p>
          {`${entry.comments}`}
        </p>
      </React.Fragment>
    );
  });
  return myParser;
};

const ClosedTradeDetail = ({ trade, fxLastPrices }) => {
  const {
    entry,
    exit,
  } = trade;

  const {
    totalPips,
    totalDollars,
  } = getProfits([trade], fxLastPrices, true);

  return (
    <div className="tradedetail">
      <div className="tradedata">
        {
          `Entry Date: ${moment(entry[0].date).format('L')}
          Cost Basis: ${costBasis(entry)[1]}
          Position Size: ${costBasis(entry)[0]}`
        }
      </div>
      <div className="entrycomments">
        {
          generateEntryComments(entry)
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

ClosedTradeDetail.propTypes = {
  trade: PropTypes.objectOf(PropTypes.any).isRequired,
  fxLastPrices: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ClosedTradeDetail;
