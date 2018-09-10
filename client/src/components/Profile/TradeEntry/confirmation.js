import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import moment from 'moment';

import { getPips, getDollarsPerPip } from '../../../utilitiy/orders';

const Confirmation = ({
  model: { long },
  model: { stop },
  model: { symbol },
  model: { date },
  model: { size },
  model: { price },
  model: { comments },
  lastPrices,
}) => (
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
Risk in Dollars = $${getDollarsPerPip(symbol, lastPrices) * getPips(symbol, stop - price) * (size / 100000)}`
      }
    </div>
  </Col>
);

Confirmation.propTypes = {
  model: PropTypes.objectOf(PropTypes.any).isRequired,
  lastPrices: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default Confirmation;
