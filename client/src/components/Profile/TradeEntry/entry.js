import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// bootstrap
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import EntryForm from './entryForm';
import Confirmation from './confirmation';
import SavedModels from './savedmodels';
import { symbolList, postNewTrade } from '../../../utilitiy/orders';

import './css/entry.css';

class TradeEntry extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps) {
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
    dateFocus: false,
    readyToSubmit: false,
    confirm: false,
    tradeModel: {},
    confirmationModel: {},
    lastPrice: '',
    savedModels: JSON.parse(localStorage.getItem('tradeideas')),
  };
  this.setState(emptyForm);
}

checkValidity = (field, value) => {
  let isValid = false;
  switch (field) {
    case 'symbol':
      if ((/^[a-zA-Z]+$/.test(value)) &&
      symbolList.includes(value.toUpperCase())) {
        isValid = true;
        this.setState({
          lastPrice: this.props.fxLastPrices[value.toUpperCase()],
        });
      } else {
        this.setState({
          lastPrice: '',
        });
      }
      break;
    case 'size':
      if (Number.isInteger(Number(value)) && (value)) isValid = true;
      break;
    case 'stop':
      if (Number(value)) {
        if (this.state.direction[0] === 'Long' && Number(value) < this.state.price[0]) isValid = true;
        if (this.state.direction[0] === 'Short' && Number(value) > this.state.price[0]) isValid = true;
      }
      break;
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

inputValidity = field => (this.state[field][1] ? { valid: true } : { invalid: true });

handleChange = (event) => {
  if (Object.prototype.hasOwnProperty.call(event, '_isAMomentObject')) {
    this.setState({
      date: [event, true],
    });
    return;
  }
  const { name, value } = event.target;

  const inputIsValid = ((name === 'direction') || (name === 'date')) ? true : this.checkValidity(name, value);

  if ((name === 'direction') || (name === 'price') || (name === 'symbol')) {
    this.setState({
      [name]: [value, inputIsValid],
      stop: ['', false],
    }, () => this.submitReady());
  } else {
    this.setState({
      [name]: [value, inputIsValid],
    }, () => this.submitReady());
  }
}

submitReady = () => {
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

confirmTrade = () => {
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
  const confirmationModel = {
    tempId: Date.now(),
    symbol: this.state.symbol[0].toUpperCase(),
    long: this.state.direction[0] === 'Long', // true = long
    stop: Number(this.state.stop[0]),
    date: Date.parse(this.state.date[0]._d),
    size: parseInt(this.state.size[0], 10),
    price: Number(this.state.price[0]),
    comments: this.state.comments[0],
  };
  this.setState({ confirm: true, tradeModel, confirmationModel });
}

confirmButtonState = () => (this.state.readyToSubmit ? { disabled: false } : { disabled: true })

cancelTrade = () => {
  if (!this.state.confirm) {
    this.setState({ confirm: false }, () => this.props.onToggle());
    return;
  }
  this.setState({ confirm: false });
}

saveTradeModel = () => {
  if (!this.state.savedModels) {
    this.setState({ savedModels: [this.state.confirmationModel] }, () => localStorage.setItem('tradeideas', JSON.stringify(this.state.savedModels)));
  } else {
    let copyOfSavedModels = JSON.parse(JSON.stringify(this.state.savedModels));
    const savedSymbolList = copyOfSavedModels.map(l => l.symbol);
    if (savedSymbolList.includes(this.state.confirmationModel.symbol)) {
      const indexOfSymbol = copyOfSavedModels.findIndex(m =>
        m.symbol === this.state.confirmationModel.symbol);
      copyOfSavedModels = [...copyOfSavedModels.slice(0, indexOfSymbol),
        ...copyOfSavedModels.slice(indexOfSymbol + 1)];
    }
    this.setState({
      savedModels: [...copyOfSavedModels, this.state.confirmationModel],
    }, () => localStorage.setItem('tradeideas', JSON.stringify(this.state.savedModels)));
  }
  this.cancelTrade();
}

handleSavedModel = (clicked, tempId) => {
  let copyOfSavedModels = JSON.parse(JSON.stringify(this.state.savedModels));
  const indexOfModel = copyOfSavedModels.findIndex(m => m.tempId === tempId);
  if (typeof (clicked.target.className) === 'string') {
    this.setState({
      symbol: [this.state.savedModels[indexOfModel].symbol, true], // pattern [value, validity]
      direction: [this.state.savedModels[indexOfModel].long ? 'Long' : 'Short', true],
      date: [moment(this.state.savedModels[indexOfModel].date), true],
      stop: [this.state.savedModels[indexOfModel].stop, true],
      size: [this.state.savedModels[indexOfModel].size, true],
      price: [this.state.savedModels[indexOfModel].price, true],
      comments: [this.state.savedModels[indexOfModel].comments, true],
      lastPrice: this.props.fxLastPrices[this.state.savedModels[indexOfModel].symbol.toUpperCase()],
    }, () => this.submitReady());
    return;
  }
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
  await postNewTrade(this.state.tradeModel);
  window.location.assign('/');
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
          />
          :
          <React.Fragment>
            {
              this.state.savedModels ?
                <SavedModels
                  models={this.state.savedModels}
                  handleSavedModel={(clicked, tempId) => this.handleSavedModel(clicked, tempId)}
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
            <Button
              color="danger"
              onClick={this.saveTradeModel}
            >Save
            </Button>
            <Button
              color="success"
              onClick={this.enterTrade}
            >Enter Trade
            </Button>
          </React.Fragment>
          :
          <div className="entryfooter">
            <FontAwesomeIcon
              icon={faTrash}
              className="clearform"
              onClick={this.initializeForm}
            />
            <Button
              color="success"
              className="float-right"
              onClick={this.confirmTrade}
              {...this.confirmButtonState()}
              block
            >Confirm Trade
            </Button>
          </div>
        }
      </ModalFooter>
    </Modal>
  );
}

}

TradeEntry.defaultProps = {

};

TradeEntry.propTypes = {
  onToggle: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  fxLastPrices: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default TradeEntry;
