import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import moment from 'moment';

const Confirmation = ({ model }) => (
  <Col sm={12}>
    <div id="entrydata">
      {
        `${model.long ? 'Bought ' : 'Sold '}${model.entry[model.entry.length - 1].size} of ${model.symbol} @ ${model.entry[model.entry.length - 1].price} with a stop of ${model.stop} on ${moment(model.entry[model.entry.length - 1].date).format('L')}`
      }
      <br />
    </div>
    <div id="entrycomments">
      {
        `${model.entry[model.entry.length - 1].comments}`
      }
    </div>
  </Col>
);

Confirmation.propTypes = {
  model: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default Confirmation;
