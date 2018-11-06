// dumb component renders management buttons
// called by TradeModification
import React from 'react';
import PropTypes from 'prop-types';
import { Col, Button } from 'reactstrap';

const RenderCondtrolsButton = (props) => {
  // conditionally render modal footer depending on stop move / exit or info
  if (!props.controlButtons) return null;
  else if (props.controlButtons.full) {
    return (
      <React.Fragment>
        <div className="managementbuttons">
          <Button
            color="primary"
            className="managetradebutton"
            onClick={() => props.handleButtonAction('moveStop')}
          >Move Stop
          </Button>
          <Button
            color="danger"
            className="managetradebutton"
            onClick={() => props.handleButtonAction('addPoisition')}
          >Add Position
          </Button>
          <Button
            color="warning"
            className="managetradebutton"
            onClick={() => props.handleButtonAction('exitTrade')}
          >Close Trade
          </Button>
        </div>
      </React.Fragment>
    );
  } else if (props.controlButtons.moveStop) {
    return (
      <React.Fragment>
        <Col sm={12}>
          <Button
            color="primary"
            className="float-left"
            onClick={props.moveStopButton[1]}
            {...props.moveStopButton[0]()}
            block
          >Move Stop
          </Button>
        </Col>
      </React.Fragment>
    );
  } else if (props.controlButtons.addPoisition) {
    return (
      <React.Fragment>
        <Col sm={12}>
          <Button
            color="danger"
            className="float-left"
            onClick={props.addPositionButton[1]}
            {...props.addPositionButton[0]()}
            block
          >Add Position
          </Button>
        </Col>
      </React.Fragment>
    );
  } else if (props.controlButtons.exitTrade) {
    return (
      <React.Fragment>
        <Col sm={12}>
          <Button
            color="warning"
            className="float-right"
            onClick={props.exitButton[1]}
            {...props.exitButton[0]()}
            block
          >Close Trade
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
