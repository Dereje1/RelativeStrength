import React, { Component } from 'react';
import PropTypes from 'prop-types';

// bootstrap
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './css/management.css';

import TradeDetail from './tradedetail';
import ModifyStop from './modifyStop';
import { setStop } from '../../../utilitiy/orders';

class TradeModification extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) this.initializeForm();
  }

  initializeForm = () => {
    const emptyForm = {
      moveStop: {
        displayForm: false,
        stop: [this.props.trade.stop, false],
        submit: true,
      },
      controlButtons: {
        full: true,
        moveStop: false,
        closeTrade: false,
      },
    };
    this.setState(emptyForm);
  }

  handleStopChange = (event) => {
    const { value } = event.target;
    const validity = this.checkStopValidity(value);
    const copyOfState = JSON.parse(JSON.stringify(this.state));
    copyOfState.moveStop.stop = [value, validity];
    copyOfState.moveStop.submit = validity;
    this.setState(copyOfState);
  }

  checkStopValidity = (value) => {
    let isValid = false;
    if (Number(value)) {
      if (this.props.trade.long && Number(value) > this.props.trade.stop) isValid = true;
      if (!this.props.trade.long && Number(value) < this.props.trade.stop) isValid = true;
    }
    return isValid;
  }

  inputStopValidity = () => (this.state.moveStop.stop[1] ? { valid: true } : { invalid: true });
  moveStopButtonState = () => (this.state.moveStop.submit ?
    { disabled: false } : { disabled: true })

  stopAdjustment = () => {
    const copyOfState = JSON.parse(JSON.stringify(this.state));
    copyOfState.moveStop.displayForm = true;
    copyOfState.moveStop.submit = false;
    copyOfState.controlButtons.moveStop = true;
    copyOfState.controlButtons.full = false;
    this.setState(copyOfState);
  }

  submitNewStop = async () => {
    const newStopObject = {
      tradeId: this.props.trade._id,
      newStop: Number(this.state.moveStop.stop[0]),
    };
    await setStop(newStopObject);
    window.location.assign('/');
  }

  cancelModify = () => {
    if (this.state.moveStop.displayForm) {
      const copyOfState = JSON.parse(JSON.stringify(this.state));
      copyOfState.moveStop.displayForm = false;
      copyOfState.moveStop.submit = true;
      copyOfState.controlButtons.moveStop = false;
      copyOfState.controlButtons.full = true;
      this.setState(copyOfState);
    } else this.props.onToggle();
  };

  modalBodyRender = () => (
    this.state.moveStop.displayForm ?
      <ModifyStop
        sendStopValue={fv => this.handleStopChange(fv)}
        formVal={this.state.moveStop.stop}
        validity={() => this.inputStopValidity()}
      />
      :
      <TradeDetail
        trade={this.props.trade}
        fxLastPrices={this.props.fxLastPrices}
      />
  );

  controlButtonsRender = () => {
    if (this.state.controlButtons.full) {
      return (
        <React.Fragment>
          <Col sm={6}>
            <Button
              color="primary"
              className="float-left"
              onClick={this.stopAdjustment}
              {...this.moveStopButtonState()}
            >Move Stop
            </Button>
          </Col>
          <Col sm={6}>
            <Button
              color="warning"
              className="float-right"
              onClick={this.confirmTrade}
            >Close Trade
            </Button>
          </Col>
        </React.Fragment>
      );
    } else if (this.state.controlButtons.moveStop) {
      return (
        <React.Fragment>
          <Col sm={12}>
            <Button
              color="primary"
              className="float-left"
              onClick={this.submitNewStop}
              {...this.moveStopButtonState()}
              block
            >Move Stop
            </Button>
          </Col>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Col sm={8}>
          <Button
            color="success"
            className="float-right"
            onClick={this.confirmTrade}
          >Close Trade
          </Button>
        </Col>
      </React.Fragment>
    );
  }

  render() {
    if (!Object.keys(this.props.trade).length) return null;
    if (!Object.keys(this.state).length) return null;
    return (
      <Modal
        isOpen={this.props.show}
      >
        <ModalHeader className="CustomModalHeader">
          <div>
            {`${this.props.trade.symbol} `}
            <FontAwesomeIcon
              className={this.props.trade.long ? 'directionalArrowUp' : 'directionalArrowDown'}
              icon={this.props.trade.long ? faArrowUp : faArrowDown}
            />
          </div>
          <Button
            color="danger"
            className="float-left"
            onClick={this.cancelModify}
          >Cancel
          </Button>
        </ModalHeader>
        <ModalBody id="mbody">
          {this.modalBodyRender()}
        </ModalBody>
        <ModalFooter>
          {this.controlButtonsRender()}
        </ModalFooter>
      </Modal>
    );
  }

}

TradeModification.propTypes = {
  onToggle: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  trade: PropTypes.objectOf(PropTypes.any).isRequired,
  fxLastPrices: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default TradeModification;
