import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// bootstrap
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

import TradeDetail from './tradedetail';
import ModifyStop from './modifyStopForm';
import ExitForm from './exitTradeForm';
import { setStop, closeTrade } from '../../../utilitiy/orders';

import './css/management.css';

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
      exitTrade: {
        displayForm: false,
        // no clue why date picker needs to call moment as a function here but not in entry!!
        date: [moment(), true],
        price: [this.props.fxLastPrices[this.props.trade.symbol], false],
        comments: ['', false],
        submit: true,
      },
      controlButtons: {
        full: true,
        moveStop: false,
        closeTrade: false,
      },
      dateFocus: false,
    };
    this.setState(emptyForm);
  }

  // Stop Adjustment
  stopAdjustment = () => {
    const copyOfState = JSON.parse(JSON.stringify(this.state));
    copyOfState.moveStop.displayForm = true;
    copyOfState.moveStop.submit = false;
    copyOfState.controlButtons.moveStop = true;
    copyOfState.controlButtons.full = false;
    this.setState(copyOfState);
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

  submitNewStop = async () => {
    const newStopObject = {
      tradeId: this.props.trade._id,
      newStop: Number(this.state.moveStop.stop[0]),
    };
    await setStop(newStopObject);
    window.location.assign('/');
  }
  /* end stop Adjustment */

  // Exiting Trades
  exitTrade = () => {
    const copyOfState = JSON.parse(JSON.stringify(this.state));
    copyOfState.exitTrade.displayForm = true;
    copyOfState.exitTrade.submit = false;
    copyOfState.exitTrade.date = [moment(), true];
    copyOfState.controlButtons.closeTrade = true;
    copyOfState.controlButtons.full = false;
    copyOfState.exitTrade.submit = false;
    this.setState(copyOfState);
  }

  handleExitChange = (event) => {
    const copyOfState = JSON.parse(JSON.stringify(this.state));
    if (Object.prototype.hasOwnProperty.call(event, '_isAMomentObject')) {
      copyOfState.exitTrade.date = [event, true];
      this.setState(copyOfState);
      return;
    }
    const { name, value } = event.target;
    const inputIsValid = this.checkExitValidity(name, value);
    copyOfState.exitTrade[name] = [value, inputIsValid];
    copyOfState.exitTrade.date = [this.state.exitTrade.date[0], true];
    this.setState(copyOfState, () => this.exitButton());
  }

  checkExitValidity = (field, value) => {
    let isValid = false;
    switch (field) {
      case 'price':
        if (Number(value)) isValid = true;
        break;
      case 'comments':
        if (value) isValid = true;
        break;
      default:
        break;
    }
    return isValid;
  }

  exitButton = () => {
    const copyOfState = JSON.parse(JSON.stringify(this.state));
    const stateKeys = Object.keys(this.state.exitTrade);
    const validatedInputs = ['price', 'comments'];
    let buttonState = true;
    stateKeys.forEach((k) => {
      if (validatedInputs.includes(k) && !this.state.exitTrade[k][1]) {
        buttonState = false;
      }
    });
    copyOfState.exitTrade.submit = buttonState;
    copyOfState.exitTrade.date = [this.state.exitTrade.date[0], true];
    this.setState(copyOfState);
  }

  inputExitValidity = field => (this.state.exitTrade[field][1] ?
    { valid: true } : { invalid: true });

  exitButtonState = () => (this.state.exitTrade.submit ?
    { disabled: false } : { disabled: true })

  submitExit = async () => {
    const exitObject = {
      tradeId: this.props.trade._id,
      exitInfo: [
        {
          date: Date.parse(this.state.exitTrade.date[0]._d),
          size: parseInt(this.props.trade.entry[0].size, 10),
          price: Number(this.state.exitTrade.price[0]),
          comments: this.state.exitTrade.comments[0],
        },
      ],
    };
    await closeTrade(exitObject);
    window.location.assign('/');
  }

  /* End Exit trade */

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

  modalBodyRender = () => {
    // lastPrice={this.props.fxLastPrices[this.props.trade.symbol]}
    if (this.state.moveStop.displayForm) {
      return (
        <ModifyStop
          sendStopValue={fv => this.handleStopChange(fv)}
          formVal={this.state.moveStop.stop}
          validity={() => this.inputStopValidity()}
        />
      );
    } else if (this.state.exitTrade.displayForm) {
      return (
        <ExitForm
          sendFormValue={fv => this.handleExitChange(fv)}
          date={this.state.exitTrade.date[0]}
          focused={this.state.dateFocus}
          onDateFocus={() => this.setState({ dateFocus: !this.state.dateFocus })}
          validity={name => this.inputExitValidity(name)}
          price={this.state.exitTrade.price[0]}
          comments={this.state.exitTrade.comments[0]}
        />
      );
    }

    return (
      <TradeDetail
        trade={this.props.trade}
        fxLastPrices={this.props.fxLastPrices}
      />
    );
  };

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
              onClick={this.exitTrade}
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
        <Col sm={12}>
          <Button
            color="success"
            className="float-right"
            onClick={this.submitExit}
            {...this.exitButtonState()}
            block
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
