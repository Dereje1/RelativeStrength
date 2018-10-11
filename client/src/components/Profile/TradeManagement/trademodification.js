// modal modifies an open trade
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// bootstrap fontawesome css
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './css/management.css';
// api calls, fx computations and validation
import { setStop, closeTrade, addTrade } from '../../../utilitiy/api';
import { getDollarsPerPip, costBasis, getNewRisk } from '../../../utilitiy/fxcomputations';
import checkValidity from '../../../utilitiy/validation';
// custom components
import OpenTradeDetail from './opentradedetail';
import ModifyStopForm from './modifyStopForm';
import ExitTradeForm from './exitTradeForm';
import AddPositionForm from './addPositionForm';
import RenderControlsButton from './renderContolsButton';

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
      addPoisition: { // for add shares modal
        displayForm: false,
        newRisk: null,
        date: [moment(), true],
        price: [this.props.fxLastPrices[this.props.trade.symbol], false],
        size: ['', false],
        moveStop: [this.props.trade.stop, false],
        comments: ['', false],
        submit: true,
      },
      controlButtons: {
        full: true,
        moveStop: false,
        exitTrade: false,
        addPoisition: false,
      },
      dateFocus: false,
      loading: false,
    };
    this.setState(emptyForm);
  }

  /* Stop Adjustment */
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
    this.disableAllControlButtons();
    const entryCopy = JSON.parse(JSON.stringify(this.props.trade.entry));
    const stopComments = `\nMoved stop from ${this.props.trade.stop} to ${this.state.moveStop.stop[0]}`;
    entryCopy[entryCopy.length - 1].comments += stopComments;
    const newStopObject = {
      tradeId: this.props.trade._id,
      newStop: Number(this.state.moveStop.stop[0]),
      updatedEntry: entryCopy,
    };
    this.setState({ loading: true });
    await setStop(newStopObject);
    window.location.assign('/');
  }
  /* end stop Adjustment */

  /* Exiting Trade */

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
    this.setState(copyOfState, () => this.updateButtonStatus('exitTrade', ['price', 'comments']));
  }

  inputExitValidity = field => (this.state.exitTrade[field][1] ?
    { valid: true } : { invalid: true });

  exitButtonState = () => (this.state.exitTrade.submit ?
    { disabled: false } : { disabled: true })

  submitExit = async () => {
    this.disableAllControlButtons();
    const exitObject = {
      tradeId: this.props.trade._id,
      exitInfo: [
        {
          date: Date.parse(this.state.exitTrade.date[0]._d),
          size: parseInt(costBasis(this.props.trade.entry)[0], 10),
          price: Number(this.state.exitTrade.price[0]),
          pipValue: getDollarsPerPip(this.props.trade.symbol, this.props.fxLastPrices),
          comments: this.state.exitTrade.comments[0],
        },
      ],
    };
    this.setState({ loading: true });
    await closeTrade(exitObject);
    window.location.assign('/');
  }

  /* End Exit trade */

  /* Add Position */
  handleAddPosition = (event) => {
    const copyOfState = JSON.parse(JSON.stringify(this.state));
    if (Object.prototype.hasOwnProperty.call(event, '_isAMomentObject')) {
      copyOfState.addPoisition.date = [event, true];
      this.setState(copyOfState);
      return;
    }
    const { name, value } = event.target;
    const inputIsValid = checkValidity(name, value, this.props.trade.long, this.props.trade.stop);
    copyOfState.addPoisition[name] = [value, inputIsValid];
    // note reset of date eventhough it is handled by react dates
    // deep copy does not work on functions within objects
    copyOfState.addPoisition.date = [this.state.addPoisition.date[0], true];
    this.setState(copyOfState, () => this.updateButtonStatus('addPoisition', ['price', 'comments', 'size', 'moveStop']));
  }

  addPositionValidity = field => (this.state.addPoisition[field][1] ?
    { valid: true } : { invalid: true });

  addPositionButtonState = () => (this.state.addPoisition.submit ?
    { disabled: false } : { disabled: true })

  submitAddPosition = async () => {
    this.disableAllControlButtons();
    const newEntry = [
      {
        date: Date.parse(this.state.addPoisition.date[0]._d),
        size: parseInt(this.state.addPoisition.size[0], 10),
        price: Number(this.state.addPoisition.price[0]),
        comments: this.state.addPoisition.comments[0],
      },
    ];

    const updatedTradeModel = {
      tradeId: this.props.trade._id,
      updated: {
        stop: Number(this.state.addPoisition.moveStop[0]),
        entry: [...this.props.trade.entry, ...newEntry],
      },
    };
    this.setState({ loading: true });
    await addTrade(updatedTradeModel);
    window.location.assign('/');
  }

  /* End Position Add */

  handleButtonAction = (action) => {
    const copyOfState = JSON.parse(JSON.stringify(this.state));
    copyOfState[action].displayForm = true;
    copyOfState[action].submit = false;
    copyOfState[action].date = [moment(), true];
    copyOfState.controlButtons[action] = true;
    copyOfState.controlButtons.full = false;
    copyOfState[action].submit = false;
    this.setState(copyOfState);
  }
  updateButtonStatus = (action, validatedInputs) => {
    const copyOfState = JSON.parse(JSON.stringify(this.state));
    const stateKeys = Object.keys(this.state[action]);
    // const validatedInputs = ['price', 'comments', 'size'];
    let buttonState = true;
    stateKeys.forEach((k) => {
      if (validatedInputs.includes(k) && !this.state[action][k][1]) {
        buttonState = false;
      }
    });
    copyOfState[action].submit = buttonState;
    copyOfState[action].date = [this.state[action].date[0], true];
    if ((action === 'addPoisition') && buttonState) {
      copyOfState[action].newRisk = getNewRisk(
        this.props.trade,
        this.state.addPoisition,
        this.props.fxLastPrices,
      );
    } else copyOfState[action].newRisk = null;
    this.setState(copyOfState);
  }

  disableAllControlButtons = () => {
    const stateCopy = JSON.parse(JSON.stringify(this.state));
    stateCopy.addPoisition.date = [this.state.addPoisition.date[0], true];
    stateCopy.exitTrade.date = [this.state.exitTrade.date[0], true];
    Object.keys(this.state.controlButtons).forEach((cb) => {
      if (stateCopy.controlButtons[cb]) stateCopy.controlButtons[cb] = false;
    });
    this.setState(stateCopy);
  }


  cancelModify = () => {
    let formType;
    Object.keys(this.state).forEach((o) => {
      if (this.state[o].displayForm) formType = o;
    });
    if (formType) {
      const copyOfState = JSON.parse(JSON.stringify(this.state));
      copyOfState[formType].displayForm = false;
      copyOfState[formType].submit = true;
      copyOfState.controlButtons[formType] = false;
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
          loading={this.state.loading}
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
          loading={this.state.loading}
        />
      );
    } else if (this.state.addPoisition.displayForm) {
      return (
        <AddPositionForm
          sendFormValue={fv => this.handleAddPosition(fv)}
          date={this.state.addPoisition.date[0]}
          focused={this.state.dateFocus}
          onDateFocus={() => this.setState({ dateFocus: !this.state.dateFocus })}
          validity={name => this.addPositionValidity(name)}
          price={this.state.addPoisition.price[0]}
          stop={this.state.addPoisition.moveStop[0]}
          size={this.state.addPoisition.size[0]}
          comments={this.state.addPoisition.comments[0]}
          risk={this.state.addPoisition.newRisk}
          loading={this.state.loading}
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
          <RenderControlsButton
            controlButtons={this.state.controlButtons}
            handleButtonAction={action => this.handleButtonAction(action)}
            moveStopButton={[this.moveStopButtonState, this.submitNewStop]}
            addPositionButton={[this.addPositionButtonState, this.submitAddPosition]}
            exitButton={[this.exitButtonState, this.submitExit]}
          />
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
