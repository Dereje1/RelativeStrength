// dumb component to confirm trade entry
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// bootstrap
import { Col } from 'reactstrap';
// profit/ loss computation functions
import { getPips, getDollarsPerPip } from '../../../utilitiy/fxcomputations';

const Confirmation = ({
  model: { long },
  model: { stop },
  model: { symbol },
  model: { date },
  model: { size },
  model: { price },
  model: { comments },
  lastPrices,
  loading,
}) => (
  !loading ?
    <Col sm={12} className="confirmation">
      <div className="entrydata">
        {
          `${long ? 'Bought ' : 'Sold '}${size / 100000} Lots of ${symbol} @ ${price} with a stop of ${stop} on ${moment(date).format('L')}`
        }
        <br />
      </div>
      <div className="entrycomments">
        {
          `${comments}`
        }
      </div>
      <div className="entryrisk">
        {
          `Risk in Pips = ${getPips(symbol, stop - price)}
Risk in Dollars = $${Math.ceil(getDollarsPerPip(symbol, lastPrices) * getPips(symbol, stop - price) * (size / 100000))}`
        }
      </div>
    </Col>
    :
    <div className="Loading" />
);

Confirmation.propTypes = {
  model: PropTypes.objectOf(PropTypes.any).isRequired,
  lastPrices: PropTypes.objectOf(PropTypes.any).isRequired,
  loading: PropTypes.bool.isRequired,
};
export default Confirmation;
