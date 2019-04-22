import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// bootstrap, fontawesome and css
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
// custom components
import EntryForm from './entryForm';
import Confirmation from './confirmation';
import SavedModels from './savedmodels';
// api calls and validation
import { postNewTrade } from '../../../utilitiy/api';
import checkValidity from '../../../utilitiy/validation';
import { getProfits } from '../../../utilitiy/fxcomputations';
import './styles/entry.scss';

class TradeEntry extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps) {
    const { show } = this.props;
    // modal is always mounted and can not use CDM to detect
    if (prevProps.show !== show) this.initializeForm();
  }

  initializeForm = () => {
    const emptyForm = {
      symbol: ['', false], // pattern [value, validity]
      direction: ['Long', true],
      date: [moment(), true],
      stop: ['', false],
      size: ['', false],
      price: ['', false],
      comments: ['', false],
      dateFocus: false, // needed for react dates
      readyToSubmit: false, // disables/enables confiramtion button
      confirm: false,
      lastPrice: '', // for display purposes
      savedModels: JSON.parse(localStorage.getItem('tradeideas')),
      tradeModel: {},
      confirmationModel: {},
      loading: false,
      disableEntry: false,
      risk: null,
    };
    this.setState(emptyForm);
  }

  // notation used by reactstrap for valid/invalid input fields
  // eslint-disable-next-line react/destructuring-assignment
  inputValidity = field => (this.state[field][1] ? { valid: true } : { invalid: true });

  handleChange = (event) => {
    // if event is date change it will not have name and value, must detect by other means
    if (Object.prototype.hasOwnProperty.call(event, '_isAMomentObject')) {
      this.setState({
        date: [event, true],
      });
      return;
    }
    const { date } = this.state;
    const { fxLastPrices } = this.props;
    const { name, value } = event.target;
    const stateCopy = JSON.parse(JSON.stringify(this.state));
    const validatedInputs = ['symbol', 'direction', 'stop', 'size', 'price', 'comments'];
    validatedInputs.forEach((fieldName) => {
      // if field is being updated use latest value otherwise use stored value
      const valueChecked = fieldName === name ? value : stateCopy[fieldName][0];
      const isLong = name === 'direction' ? value === 'Long' : stateCopy.direction[0] === 'Long';
      const priceChecked = name === 'price' ? value : stateCopy.price[0];
      const isValid = checkValidity(fieldName, valueChecked, isLong, priceChecked);
      stateCopy[fieldName] = [valueChecked, isValid];
    });
    stateCopy.date = [date[0], true];
    if (stateCopy.symbol[1]) { // if symbol is valid display latest price
      stateCopy.lastPrice = fxLastPrices[stateCopy.symbol[0].toUpperCase()];
    } else {
      stateCopy.stop = ['', false];
      stateCopy.size = ['', false];
      stateCopy.price = ['', false];
      stateCopy.comments = ['', false];
      stateCopy.lastPrice = '';
    }
    this.setState(stateCopy, () => this.submitReady());
  }

  submitReady = async () => {
    // scans thru all inputs for passing vaildity and enables confirmation
    const stateKeys = Object.keys(this.state);
    const validatedInputs = ['symbol', 'stop', 'size', 'price', 'comments'];
    let buttonState = true;
    stateKeys.forEach((k) => {
      // eslint-disable-next-line react/destructuring-assignment
      if (validatedInputs.includes(k) && !this.state[k][1]) buttonState = false;
    });
    const { tradeModel, fxLastPrices } = this.state;
    if (buttonState) {
      await this.confirmTrade(false);
      const riskCalc = getProfits([tradeModel], fxLastPrices);
      const riskDisplay = `Risk: ${riskCalc.openRiskPips} Pips, $${riskCalc.openRiskDollars}`;
      this.setState({ readyToSubmit: true, risk: riskDisplay });
    } else this.setState({ readyToSubmit: false, risk: null });
  }

  confirmTrade = (displayConfirmation = true) => {
    // tradeModel is used for posting new trade to db
    const {
      symbol, direction, stop, date,
      size, price, comments,
    } = this.state;
    const { userId } = this.props;
    const tradeModel = {
      userId,
      tradeStatusOpen: true, // true = Open
      symbol: symbol[0].toUpperCase(),
      long: direction[0] === 'Long', // true = long
      stop: Number(stop[0]),
      entry: [
        {
          date: Date.parse(date[0]._d),
          size: parseInt(size[0], 10),
          price: Number(price[0]),
          comments: comments[0],
        },
      ],
    };
    // confirmationModel is used for local storage
    const confirmationModel = {
      symbol: symbol[0].toUpperCase(),
      long: direction[0] === 'Long', // true = long
      stop: Number(stop[0]),
      date: Date.parse(date[0]._d),
      size: parseInt(size[0], 10),
      price: Number(price[0]),
      comments: comments[0],
    };
    this.setState({ confirm: displayConfirmation, tradeModel, confirmationModel });
  }

  // for reactstrap button state
  confirmButtonState = () => {
    const { readyToSubmit } = this.state;
    return (readyToSubmit ? { disabled: false } : { disabled: true });
  }

  cancelTrade = () => {
    // if in confirmation mode no need to close the whole modal
    const { confirm } = this.state;
    const { onToggle } = this.state;
    if (!confirm) {
      this.setState({ confirm: false }, () => onToggle());
      return;
    }
    this.setState({ confirm: false });
  }

  saveTradeModel = async () => {
    // for local storage, async since we first need to set state of the confirmation model
    await this.confirmTrade(false);
    const { savedModels, confirmationModel } = this.state;
    if (!savedModels) {
      // nothing saved in local storage ... save first symbol
      this.setState({ savedModels: [confirmationModel] }, () => localStorage.setItem('tradeideas', JSON.stringify(savedModels)));
    } else {
      let copyOfSavedModels = JSON.parse(JSON.stringify(savedModels));
      const savedSymbolList = copyOfSavedModels.map(l => l.symbol);
      if (savedSymbolList.includes(confirmationModel.symbol)) {
        // remove symbol if it already exists in local storage
        const indexOfSymbol = copyOfSavedModels.findIndex(m => m.symbol
          === confirmationModel.symbol);
        copyOfSavedModels = [...copyOfSavedModels.slice(0, indexOfSymbol),
          ...copyOfSavedModels.slice(indexOfSymbol + 1)];
      }
      this.setState({
        savedModels: [...copyOfSavedModels, confirmationModel],
      }, () => localStorage.setItem('tradeideas', JSON.stringify(savedModels)));
    }
    // this.cancelTrade(); // close modal after saving symbol
  }

  handleSavedModel = (clicked, symbol) => {
    // handles saved symbol click
    const { savedModels } = this.state;
    const { fxLastPrices } = this.props;
    let copyOfSavedModels = JSON.parse(JSON.stringify(savedModels));
    const indexOfModel = copyOfSavedModels.findIndex(m => m.symbol === symbol);
    if (typeof (clicked.target.className) === 'string') {
      // load symbol stored iocally
      this.setState({
        symbol: [savedModels[indexOfModel].symbol, true],
        direction: [savedModels[indexOfModel].long ? 'Long' : 'Short', true],
        date: [moment(savedModels[indexOfModel].date), true],
        stop: [savedModels[indexOfModel].stop, true],
        size: [savedModels[indexOfModel].size, true],
        price: [savedModels[indexOfModel].price, true],
        comments: [savedModels[indexOfModel].comments, true],
        lastPrice: fxLastPrices[
          savedModels[indexOfModel].symbol.toUpperCase()
        ],
      }, () => this.submitReady());
      return;
    }
    // or delete locally stored symbol
    copyOfSavedModels = [...copyOfSavedModels.slice(0, indexOfModel),
      ...copyOfSavedModels.slice(indexOfModel + 1)];
    this.setState({
      savedModels: copyOfSavedModels,
    }, () => {
      // eslint-disable-next-line react/destructuring-assignment
      localStorage.setItem('tradeideas', JSON.stringify(this.state.savedModels));
      this.initializeForm();
    });
  }

  enterTrade = async () => {
    const { tradeModel } = this.state;
    const { onToggle, refreshData } = this.props;
    this.setState({ loading: true, disableEntry: true });
    await postNewTrade(tradeModel);
    onToggle();
    refreshData();
  }

  render() {
    if (!Object.keys(this.state).length) return null;
    const { show, fxLastPrices } = this.props;
    const {
      confirm, confirmationModel, loading, savedModels,
      date, dateFocus, risk, disableEntry, readyToSubmit,
    } = this.state;
    return (
      <Modal
        isOpen={show}
      >
        <ModalHeader toggle={this.cancelTrade}>
          {confirm ? 'Confirm Trade' : 'Trade Entry'}
        </ModalHeader>
        <ModalBody id="mbody">
          {confirm
            ? (
              <Confirmation
                model={confirmationModel}
                lastPrices={fxLastPrices}
                loading={loading}
              />
            )
            : (
              <React.Fragment>
                {
                  savedModels ? (
                    <SavedModels
                      models={savedModels}
                      handleSavedModel={(clicked, symbol) => this.handleSavedModel(clicked, symbol)}
                    />
                  )
                    : null
                }
                <EntryForm
                  sendFormValue={fv => this.handleChange(fv)}
                  date={date[0]}
                  focused={dateFocus}
                  onDateFocus={() => this.setState({ dateFocus: !dateFocus })}
                  validity={name => this.inputValidity(name)}
                  currentState={this.state}
                  risk={risk}
                />
              </React.Fragment>
            )}
        </ModalBody>
        <ModalFooter>
          {confirm ? (
            <React.Fragment>
              {!disableEntry ? (
                <Button
                  color="success"
                  onClick={this.enterTrade}
                  block
                >
                  {'Enter Trade'}
                </Button>
              )
                : null
              }
            </React.Fragment>
          ) : (
            <div className="entryfooter">
              <FontAwesomeIcon
                icon={faTrash}
                className="clearform"
                onClick={this.initializeForm}
              />
              {
                readyToSubmit ? (
                  <FontAwesomeIcon
                    icon={faSave}
                    className="saveform"
                    onClick={this.saveTradeModel}
                  />
                )
                  : null
              }

              <Button
                color="success"
                className="float-right"
                onClick={this.confirmTrade}
                {...this.confirmButtonState()}
              >
                {'Confirm Trade'}
              </Button>
            </div>
          )}
        </ModalFooter>
      </Modal>
    );
  }

}

TradeEntry.propTypes = {
  onToggle: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  fxLastPrices: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default TradeEntry;
