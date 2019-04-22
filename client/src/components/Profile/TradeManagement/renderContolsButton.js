// dumb component renders management buttons
// called by TradeModification
import React from 'react';
import PropTypes from 'prop-types';
import { Col, Button } from 'reactstrap';

const RenderCondtrolsButton = ({
  controlButtons, handleButtonAction, moveStopButton, addPositionButton,
  exitButton,
}) => {
  // conditionally render modal footer depending on stop move / exit or info
  if (!controlButtons) return null;
  if (controlButtons.full) {
    return (
      <React.Fragment>
        <div className="managementbuttons">
          <Button
            color="primary"
            className="managetradebutton"
            onClick={() => handleButtonAction('moveStop')}
          >
            {'Move Stop'}
          </Button>
          <Button
            color="danger"
            className="managetradebutton"
            onClick={() => handleButtonAction('addPoisition')}
          >
            {'Add Position'}
          </Button>
          <Button
            color="warning"
            className="managetradebutton"
            onClick={() => handleButtonAction('exitTrade')}
          >
            {'Close Trade'}
          </Button>
        </div>
      </React.Fragment>
    );
  } if (controlButtons.moveStop) {
    return (
      <React.Fragment>
        <Col sm={12}>
          <Button
            color="primary"
            className="float-left"
            onClick={moveStopButton[1]}
            {...moveStopButton[0]()}
            block
          >
            {'Move Stop'}
          </Button>
        </Col>
      </React.Fragment>
    );
  } if (controlButtons.addPoisition) {
    return (
      <React.Fragment>
        <Col sm={12}>
          <Button
            color="danger"
            className="float-left"
            onClick={addPositionButton[1]}
            {...addPositionButton[0]()}
            block
          >
            {'Add Position'}
          </Button>
        </Col>
      </React.Fragment>
    );
  } if (controlButtons.exitTrade) {
    return (
      <React.Fragment>
        <Col sm={12}>
          <Button
            color="warning"
            className="float-right"
            onClick={exitButton[1]}
            {...exitButton[0]()}
            block
          >
            {'Close Trade'}
          </Button>
        </Col>
      </React.Fragment>
    );
  }
  return null;
};

RenderCondtrolsButton.propTypes = {
  controlButtons: PropTypes.objectOf(PropTypes.bool).isRequired,
  handleButtonAction: PropTypes.func.isRequired,
  moveStopButton: PropTypes.arrayOf(PropTypes.func).isRequired,
  addPositionButton: PropTypes.arrayOf(PropTypes.func).isRequired,
  exitButton: PropTypes.arrayOf(PropTypes.func).isRequired,
};


export default RenderCondtrolsButton;
