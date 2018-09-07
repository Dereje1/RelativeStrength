import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// bootstrap
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import EntryForm from './entryForm';
import { symbolList, postNewTrade } from '../../../utilitiy/orders';

import './css/entry.css';

class TradeEntry extends Component {

  constructor(props) {
    super(props);
    this.state = {
      symbol: ['', false], // pattern [value, validity]
      direction: ['Long', true],
      date: [moment(), true],
      stop: [0, false],
      size: [0, false],
      price: [0, false],
      comments: ['', false],
      dateFocus: false,
      readyToSubmit: true,
    };
  }

checkValidity = (field, value) => {
  let isValid = false;
  switch (field) {
    case 'symbol':
      if ((/^[a-zA-Z]+$/.test(value)) &&
      symbolList.includes(value.toUpperCase())) {
        isValid = true;
      }
      break;
    case 'size':
      if (Number.isInteger(Number(value)) && (value)) isValid = true;
      break;
    case 'stop':
      if (Number(value)) isValid = true;
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

processNewTrade = (event) => {
  if (Object.prototype.hasOwnProperty.call(event, '_isAMomentObject')) {
    this.setState({
      date: [event, true],
    });
    return;
  }
  const { name, value } = event.target;

  const inputIsValid = ((name === 'direction') || (name === 'date')) ? true : this.checkValidity(name, value);

  this.setState({
    [name]: [value, inputIsValid],
  }, () => this.submitReady());
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

submitTrade = () => {
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
  postNewTrade(tradeModel);
}

submitButtonState = () => (this.state.readyToSubmit ? { active: true } : { disabled: true })

render() {
  return (
    <Modal
      isOpen={this.props.show}
    >
      <ModalHeader >
         Trade Entry
      </ModalHeader>
      <ModalBody id="mbody">
        <EntryForm
          sendFormValue={fv => this.processNewTrade(fv)}
          date={this.state.date[0]}
          focused={this.state.dateFocus}
          onDateFocus={() => this.setState({ dateFocus: !this.state.dateFocus })}
          validity={name => this.inputValidity(name)}
        />
      </ModalBody>
      <ModalFooter>
        <Col sm={6}>
          <Button
            color="danger"
            className="float-left"
            onClick={this.props.onToggle}
          >Cancel
          </Button>
        </Col>
        <Col sm={6}>
          <Button
            color="success"
            className="float-right"
            onClick={this.submitTrade}
            {...this.submitButtonState()}
          >Enter Trade
          </Button>
        </Col>
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
};
export default TradeEntry;
