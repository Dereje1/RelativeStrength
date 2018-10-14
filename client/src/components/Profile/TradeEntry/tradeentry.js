import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// custom components
import EntryForm from './entryForm';
import Confirmation from './confirmation';
import SavedModels from './savedmodels';
// api calls and validation
import { postNewTrade } from '../../../utilitiy/api';
import checkValidity from '../../../utilitiy/validation';
// bootstrap, fontawesome and css
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import './css/entry.css';

class TradeEntry extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps) {
    // modal is always mounted and can not use CDM to detect
    if (prevProps.show !== this.props.show) this.initializeForm();
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
    };
    this.setState(emptyForm);
  }

  // notation used by reactstrap for valid/invalid input fields
  inputValidity = field => (this.state[field][1] ? { valid: true } : { invalid: true });

  handleChange = (event) => {
    // if event is date change it will not have name and value, must detect by other means
    if (Object.prototype.hasOwnProperty.call(event, '_isAMomentObject')) {
      this.setState({
        date: [event, true],
      });
      return;
    }
    const { name, value } = event.target;
    // direction and date do not need to be validated
    const inputIsValid = (name === 'direction') ? true : checkValidity(name, value, this.state.direction[0] === 'Long', this.state.price[0]);

    if (inputIsValid && name === 'symbol') {
      this.setState({
        lastPrice: this.props.fxLastPrices[value.toUpperCase()],
      });
    }

    if (!inputIsValid && name === 'symbol') {
      this.initializeForm();
    }

    this.setState({
      [name]: [value, inputIsValid],
    }, () => this.submitReady());
  }

  submitReady = () => {
    // scans thru all inputs for passing vaildity and enables confirmation
    const stateKeys = Object.keys(this.state);
    const validatedInputs = ['symbol', 'stop', 'size', 'price', 'comments'];
    let buttonState = true;
    stateKeys.forEach((k) => {
      if (validatedInputs.includes(k) && !this.state[k][1]) {
        buttonState = false;
      }
    });
    this.setState({ readyToSubmit: buttonState });
  }

  confirmTrade = (displayConfirmation = true) => {
    // tradeModel is used for posting new trade to db
    const tradeModel = {
      userId: this.props.userId,
      tradeStatusOpen: true, // true = Open
      symbol: this.state.symbol[0].toUpperCase(),
      long: this.state.direction[0] === 'Long', // true = long
      stop: Number(this.state.stop[0]),
      entry: [
        {
          date: Date.parse(this.state.date[0]._d),
          size: parseInt(this.state.size[0], 10),
          price: Number(this.state.price[0]),
          comments: this.state.comments[0],
        },
      ],
    };
    // confirmationModel is used for local storage
    const confirmationModel = {
      symbol: this.state.symbol[0].toUpperCase(),
      long: this.state.direction[0] === 'Long', // true = long
      stop: Number(this.state.stop[0]),
      date: Date.parse(this.state.date[0]._d),
      size: parseInt(this.state.size[0], 10),
      price: Number(this.state.price[0]),
      comments: this.state.comments[0],
    };
    this.setState({ confirm: displayConfirmation, tradeModel, confirmationModel });
  }
  // for reactstrap button state
  confirmButtonState = () => (this.state.readyToSubmit ? { disabled: false } : { disabled: true })

  cancelTrade = () => {
    // if in confirmation mode no need to close the whole modal
    if (!this.state.confirm) {
      this.setState({ confirm: false }, () => this.props.onToggle());
      return;
    }
    this.setState({ confirm: false });
  }

  saveTradeModel = async () => {
    // for local storage, async since we first need to set state of the confirmation model
    await this.confirmTrade(false);
    if (!this.state.savedModels) {
      // nothing saved in local storage ... save first symbol
      this.setState({ savedModels: [this.state.confirmationModel] }, () => localStorage.setItem('tradeideas', JSON.stringify(this.state.savedModels)));
    } else {
      let copyOfSavedModels = JSON.parse(JSON.stringify(this.state.savedModels));
      const savedSymbolList = copyOfSavedModels.map(l => l.symbol);
      if (savedSymbolList.includes(this.state.confirmationModel.symbol)) {
        // remove symbol if it already exists in local storage
        const indexOfSymbol = copyOfSavedModels.findIndex(m =>
          m.symbol === this.state.confirmationModel.symbol);
        copyOfSavedModels = [...copyOfSavedModels.slice(0, indexOfSymbol),
          ...copyOfSavedModels.slice(indexOfSymbol + 1)];
      }
      this.setState({
        savedModels: [...copyOfSavedModels, this.state.confirmationModel],
      }, () => localStorage.setItem('tradeideas', JSON.stringify(this.state.savedModels)));
    }
    // this.cancelTrade(); // close modal after saving symbol
  }

  handleSavedModel = (clicked, symbol) => {
    // handles saved symbol click
    let copyOfSavedModels = JSON.parse(JSON.stringify(this.state.savedModels));
    const indexOfModel = copyOfSavedModels.findIndex(m => m.symbol === symbol);
    if (typeof (clicked.target.className) === 'string') {
      // load symbol stored iocally
      this.setState({
        symbol: [this.state.savedModels[indexOfModel].symbol, true],
        direction: [this.state.savedModels[indexOfModel].long ? 'Long' : 'Short', true],
        date: [moment(this.state.savedModels[indexOfModel].date), true],
        stop: [this.state.savedModels[indexOfModel].stop, true],
        size: [this.state.savedModels[indexOfModel].size, true],
        price: [this.state.savedModels[indexOfModel].price, true],
        comments: [this.state.savedModels[indexOfModel].comments, true],
        lastPrice: this.props.fxLastPrices[
          this.state.savedModels[indexOfModel].symbol.toUpperCase()
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
      localStorage.setItem('tradeideas', JSON.stringify(this.state.savedModels));
      this.initializeForm();
    });
  }

  enterTrade = async () => {
    this.setState({ loading: true, disableEntry: true });
    await postNewTrade(this.state.tradeModel);
    this.props.onToggle();
    this.props.refreshData();
  }

  render() {
    if (!Object.keys(this.state).length) return null;
    return (
      <Modal
        isOpen={this.props.show}
      >
        <ModalHeader toggle={this.cancelTrade}>
          {this.state.confirm ? 'Confirm Trade' : 'Trade Entry'}
        </ModalHeader>
        <ModalBody id="mbody">
          {this.state.confirm ?
            <Confirmation
              model={this.state.confirmationModel}
              lastPrices={this.props.fxLastPrices}
              loading={this.state.loading}
            />
            :
            <React.Fragment>
              {
                this.state.savedModels ?
                  <SavedModels
                    models={this.state.savedModels}
                    handleSavedModel={(clicked, symbol) => this.handleSavedModel(clicked, symbol)}
                  />
                  :
                  null
              }
              <EntryForm
                sendFormValue={fv => this.handleChange(fv)}
                date={this.state.date[0]}
                focused={this.state.dateFocus}
                onDateFocus={() => this.setState({ dateFocus: !this.state.dateFocus })}
                validity={name => this.inputValidity(name)}
                currentState={this.state}
              />
            </React.Fragment>
          }
        </ModalBody>
        <ModalFooter>
          {this.state.confirm ?
            <React.Fragment>
              {!this.state.disableEntry ?
                <Button
                  color="success"
                  onClick={this.enterTrade}
                  block
                >Enter Trade
                </Button>
                :
                null
              }
            </React.Fragment>
            :
            <div className="entryfooter">
              <FontAwesomeIcon
                icon={faTrash}
                className="clearform"
                onClick={this.initializeForm}
              />
              {
                this.state.readyToSubmit ?
                  <FontAwesomeIcon
                    icon={faSave}
                    className="saveform"
                    onClick={this.saveTradeModel}
                  />
                  :
                  null
              }

              <Button
                color="success"
                className="float-right"
                onClick={this.confirmTrade}
                {...this.confirmButtonState()}
              >Confirm Trade
              </Button>
            </div>
          }
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
