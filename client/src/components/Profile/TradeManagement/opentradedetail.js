// display detail of indivual open trade
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
        <p> {`${entry.comments}`}</p>
      </React.Fragment>
    );
  });
  return myParser;
};

const OpenTradeDetail = (props) => {
  const {
    stop,
    entry,
  } = props.trade;

  const {
    totalPips,
    totalDollars,
    openRiskPips,
    openRiskDollars,
  } = getProfits([props.trade], props.fxLastPrices);

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

OpenTradeDetail.propTypes = {
  trade: PropTypes.objectOf(PropTypes.any).isRequired,
  fxLastPrices: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OpenTradeDetail;
