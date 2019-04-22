// modal modifies an open trade
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// bootstrap fontawesome css
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './styles/management.scss';
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
    const { show } = this.props;
    if (prevProps.show !== show) this.initializeForm();
  }

  initializeForm = () => {
    const { trade, fxLastPrices } = this.props;
    const emptyForm = {
      moveStop: { // for stop modal
        displayForm: false,
        stop: [trade.stop, false],
        submit: true,
      },
      exitTrade: { // for close modal
        displayForm: false,
        date: [moment(), true],
        price: [fxLastPrices[trade.symbol], false],
        comments: ['', false],
        submit: true,
      },
      addPoisition: { // for add shares modal
        displayForm: false,
        newRisk: null,
        date: [moment(), true],
        price: [fxLastPrices[trade.symbol], false],
        size: ['', false],
        moveStop: [trade.stop, false],
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
    const { trade } = this.props;
    const { name, value } = event.target;
    const validity = checkValidity(name, value, trade.long, trade.stop);
    const copyOfState = JSON.parse(JSON.stringify(this.state));
    copyOfState.moveStop.stop = [value, validity];
    copyOfState.moveStop.submit = validity;
    this.setState(copyOfState);
  }

  // eslint-disable-next-line react/destructuring-assignment
  inputStopValidity = () => (this.state.moveStop.stop[1] ? { valid: true } : { invalid: true });

  // eslint-disable-next-line react/destructuring-assignment
  moveStopButtonState = () => (this.state.moveStop.submit
    ? { disabled: false } : { disabled: true })

  submitNewStop = async () => {
    const { trade, onToggle, refreshData } = this.props;
    const { moveStop } = this.state;
    const entryCopy = JSON.parse(JSON.stringify(trade.entry));
    const stopComments = `\nMoved stop from ${trade.stop} to ${moveStop.stop[0]}`;
    entryCopy[entryCopy.length - 1].comments += stopComments;
    const newStopObject = {
      tradeId: trade._id,
      newStop: Number(moveStop.stop[0]),
      updatedEntry: entryCopy,
    };
    this.setState({ loading: true });
    await setStop(newStopObject);
    onToggle();
    refreshData();
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
    const { exitTrade } = this.state;
    const inputIsValid = checkValidity(name, value, true, 1);
    copyOfState.exitTrade[name] = [value, inputIsValid];
    // note reset of date eventhough it is handled by react dates
    // deep copy does not work on functions within objects
    copyOfState.exitTrade.date = [exitTrade.date[0], true];
    this.setState(copyOfState, () => this.updateButtonStatus('exitTrade', ['price', 'comments']));
  }

  // eslint-disable-next-line react/destructuring-assignment
  inputExitValidity = field => (this.state.exitTrade[field][1]
    ? { valid: true } : { invalid: true });

  // eslint-disable-next-line react/destructuring-assignment
  exitButtonState = () => (this.state.exitTrade.submit
    ? { disabled: false } : { disabled: true })

  submitExit = async () => {
    const {
      trade, onToggle, refreshData, fxLastPrices,
    } = this.props;
    const { exitTrade } = this.state;
    const exitObject = {
      tradeId: trade._id,
      exitInfo: [
        {
          date: Date.parse(exitTrade.date[0]._d),
          size: parseInt(costBasis(trade.entry)[0], 10),
          price: Number(exitTrade.price[0]),
          pipValue: getDollarsPerPip(trade.symbol, fxLastPrices),
          comments: exitTrade.comments[0],
        },
      ],
    };
    this.setState({ loading: true });
    await closeTrade(exitObject);
    onToggle();
    refreshData();
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
    const { addPoisition } = this.state;
    const { trade } = this.props;
    const inputIsValid = checkValidity(name, value, trade.long, trade.stop);
    copyOfState.addPoisition[name] = [value, inputIsValid];
    // note reset of date eventhough it is handled by react dates
    // deep copy does not work on functions within objects
    copyOfState.addPoisition.date = [addPoisition.date[0], true];
    this.setState(copyOfState, () => this.updateButtonStatus('addPoisition', ['price', 'comments', 'size', 'moveStop']));
  }

  // eslint-disable-next-line react/destructuring-assignment
  addPositionValidity = field => (this.state.addPoisition[field][1]
    ? { valid: true } : { invalid: true });

  // eslint-disable-next-line react/destructuring-assignment
  addPositionButtonState = () => (this.state.addPoisition.submit
    ? { disabled: false } : { disabled: true })

  submitAddPosition = async () => {
    const { addPoisition } = this.state;
    const { trade, onToggle, refreshData } = this.props;
    const newEntry = [
      {
        date: Date.parse(addPoisition.date[0]._d),
        size: parseInt(addPoisition.size[0], 10),
        price: Number(addPoisition.price[0]),
        comments: addPoisition.comments[0],
      },
    ];

    const updatedTradeModel = {
      tradeId: trade._id,
      updated: {
        stop: Number(addPoisition.moveStop[0]),
        entry: [...trade.entry, ...newEntry],
      },
    };
    this.setState({ loading: true });
    await addTrade(updatedTradeModel);
    onToggle();
    refreshData();
  }

  /* End Position Add */

  handleButtonAction = (action) => {
    // couple selected button from callback to state
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
    // enable/disable actionable buttons depending on button passed and respective vaildation req.
    const { addPoisition } = this.state;
    const { trade, fxLastPrices } = this.props;
    const copyOfState = JSON.parse(JSON.stringify(this.state));

    // eslint-disable-next-line react/destructuring-assignment
    const stateKeys = Object.keys(this.state[action]);
    let buttonState = true;
    stateKeys.forEach((k) => {
      // eslint-disable-next-line react/destructuring-assignment
      if (validatedInputs.includes(k) && !this.state[action][k][1]) {
        buttonState = false;
      }
    });
    copyOfState[action].submit = buttonState;
    // eslint-disable-next-line react/destructuring-assignment
    copyOfState[action].date = [this.state[action].date[0], true];
    // calculate new risk associated with added position
    if ((action === 'addPoisition') && buttonState) {
      copyOfState[action].newRisk = getNewRisk(
        trade,
        addPoisition,
        fxLastPrices,
      );
    } else copyOfState[action].newRisk = null;
    this.setState(copyOfState);
  }

  cancelModify = () => {
    let formType;
    const { onToggle } = this.props;
    Object.keys(this.state).forEach((o) => {
      // eslint-disable-next-line react/destructuring-assignment
      if (this.state[o].displayForm) formType = o;
    });
    // if secondary modal open just close that
    if (formType) {
      const copyOfState = JSON.parse(JSON.stringify(this.state));
      copyOfState[formType].displayForm = false;
      copyOfState[formType].submit = true;
      copyOfState.controlButtons[formType] = false;
      copyOfState.controlButtons.full = true;
      this.setState(copyOfState);
    } else onToggle();
  };

  modalBodyRender = () => {
    // conditionally render modal depending on stop move / exit or info
    const {
      moveStop, loading, exitTrade, dateFocus, addPoisition,
    } = this.state;
    const { trade, fxLastPrices } = this.props;
    if (moveStop.displayForm) {
      return (
        <ModifyStopForm
          sendStopValue={fv => this.handleStopChange(fv)}
          formVal={moveStop.stop}
          validity={() => this.inputStopValidity()}
          loading={loading}
        />
      );
    } if (exitTrade.displayForm) {
      return (
        <ExitTradeForm
          sendFormValue={fv => this.handleExitChange(fv)}
          date={exitTrade.date[0]}
          focused={dateFocus}
          onDateFocus={() => this.setState({ dateFocus: !dateFocus })}
          validity={name => this.inputExitValidity(name)}
          price={exitTrade.price[0]}
          comments={exitTrade.comments[0]}
          loading={loading}
        />
      );
    } if (addPoisition.displayForm) {
      return (
        <AddPositionForm
          sendFormValue={fv => this.handleAddPosition(fv)}
          date={addPoisition.date[0]}
          focused={dateFocus}
          onDateFocus={() => this.setState({ dateFocus: !dateFocus })}
          validity={name => this.addPositionValidity(name)}
          price={addPoisition.price[0]}
          stop={addPoisition.moveStop[0]}
          size={addPoisition.size[0]}
          comments={addPoisition.comments[0]}
          risk={addPoisition.newRisk}
          loading={loading}
        />
      );
    }
    return (
      <OpenTradeDetail
        trade={trade}
        fxLastPrices={fxLastPrices}
      />
    );
  };

  render() {
    const { trade, show } = this.props;
    const { loading, controlButtons } = this.state;
    if (!Object.keys(trade).length) return null;
    if (!Object.keys(this.state).length) return null;
    return (
      <Modal
        isOpen={show}
      >
        <ModalHeader className="CustomModalHeader" toggle={this.cancelModify}>
          <div>
            {`${trade.symbol} `}
            <FontAwesomeIcon
              className={trade.long ? 'directionalArrowUp' : 'directionalArrowDown'}
              icon={trade.long ? faArrowUp : faArrowDown}
            />
          </div>
        </ModalHeader>
        <ModalBody id="mbody">
          {this.modalBodyRender()}
        </ModalBody>
        <ModalFooter>
          <RenderControlsButton
            controlButtons={!loading ? controlButtons : null}
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
  refreshData: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  trade: PropTypes.objectOf(PropTypes.any).isRequired,
  fxLastPrices: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default TradeModification;
