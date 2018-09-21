import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const SavedModels = ({ models, handleSavedModel }) => (
  <React.Fragment>
    <div className="savedmodels">
      {
        models.map(t =>
          (
            <h4 key={t.tempId}>
              <Badge
                className="badge"
                onClick={b => handleSavedModel(b, t.tempId)}
              >
                {`${t.symbol} `}
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  className="icon"
                  onClick={b => handleSavedModel(b, t.tempId)}
                />
              </Badge>
            </h4>))
      }
    </div>
  </React.Fragment>
);

SavedModels.propTypes = {
  models: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleSavedModel: PropTypes.func.isRequired,
};
export default SavedModels;
