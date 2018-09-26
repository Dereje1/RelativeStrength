// modal modifies an open trade
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// bootstrap fontawesome css
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './css/management.css';
// api calls, fx computations and validation
import { setStop, closeTrade } from '../../../utilitiy/api';
import { getDollarsPerPip } from '../../../utilitiy/fxcomputations';
import checkValidity from '../../../utilitiy/validation';
// custom components
import OpenTradeDetail from './opentradedetail';
import ModifyStopForm from './modifyStopForm';
import ExitTradeForm from './exitTradeForm';

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
      moveStop: { // for stop modal
        displayForm: false,
        stop: [this.props.trade.stop, false],
        submit: true,
      },
      exitTrade: { // for close modal
        displayForm: false,
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

  /* Stop Adjustment */
  stopAdjustment = () => {
    const copyOfState = JSON.parse(JSON.stringify(this.state));
    copyOfState.moveStop.displayForm = true;
    copyOfState.moveStop.submit = false;
    copyOfState.controlButtons.moveStop = true;
    copyOfState.controlButtons.full = false;
    this.setState(copyOfState);
  }
  handleStopChange = (event) => {
    const { name, value } = event.target;
    const validity = checkValidity(name, value, this.props.trade.long, this.props.trade.stop);
    const copyOfState = JSON.parse(JSON.stringify(this.state));
    copyOfState.moveStop.stop = [value, validity];
    copyOfState.moveStop.submit = validity;
    this.setState(copyOfState);
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

  /* Exiting Trade */
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
    const inputIsValid = checkValidity(name, value, true, 1);
    copyOfState.exitTrade[name] = [value, inputIsValid];
    // note reset of date eventhough it is handled by react dates
    // deep copy does not work on functions within objects
    copyOfState.exitTrade.date = [this.state.exitTrade.date[0], true];
    this.setState(copyOfState, () => this.exitButton());
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
          pipValue: getDollarsPerPip(this.props.trade.symbol, this.props.fxLastPrices),
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
    // conditionally render modal depending on stop move / exit or info
    if (this.state.moveStop.displayForm) {
      return (
        <ModifyStopForm
          sendStopValue={fv => this.handleStopChange(fv)}
          formVal={this.state.moveStop.stop}
          validity={() => this.inputStopValidity()}
        />
      );
    } else if (this.state.exitTrade.displayForm) {
      return (
        <ExitTradeForm
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
      <OpenTradeDetail
        trade={this.props.trade}
        fxLastPrices={this.props.fxLastPrices}
      />
    );
  };

  controlButtonsRender = () => {
    // conditionally render modal footer depending on stop move / exit or info
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
        <ModalHeader className="CustomModalHeader" toggle={this.cancelModify}>
          <div>
            {`${this.props.trade.symbol} `}
            <FontAwesomeIcon
              className={this.props.trade.long ? 'directionalArrowUp' : 'directionalArrowDown'}
              icon={this.props.trade.long ? faArrowUp : faArrowDown}
            />
          </div>
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
