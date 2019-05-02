// dumb component for saving symbols to local storage
import React from 'react';
import PropTypes from 'prop-types';
// bootstrap and fonteawsome
import { Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const SavedModels = ({ models, handleSavedModel }) => (
  <div className="savedmodels">
    {
      models.map(t => (
        <h4 key={t.symbol}>
          <Badge
            className="badge"
            onClick={b => handleSavedModel(b, t.symbol)}
          >
            {`${t.symbol} `}
            <FontAwesomeIcon
              icon={faTimesCircle}
              className="icon"
              onClick={b => handleSavedModel(b, t.symbol)}
            />
          </Badge>
        </h4>
      ))
    }
  </div>
);

SavedModels.propTypes = {
  models: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleSavedModel: PropTypes.func.isRequired,
};
export default SavedModels;
