import React from 'react';
import PropTypes from 'prop-types';
// react dates below
import { SingleDatePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
// bootstrap
import { Col, Form, FormGroup, Label, Input } from 'reactstrap';

const inputSize = 10;
const labelSize = 2;

const EntryForm = props => (
  <Form>
    <FormGroup row>
      <Label for="entrydate" sm={labelSize}>Date</Label>
      <Col sm={inputSize}>
        <SingleDatePicker
          date={props.date} // momentPropTypes.momentObj or null
          onDateChange={date => props.sendFormValue(date)} // PropTypes.func.isRequired
          focused={props.focused} // PropTypes.bool
          onFocusChange={() => props.onDateFocus()} // PropTypes.func.isRequired
          numberOfMonths={1}
          isOutsideRange={() => false}
          id="Trade_Entry_Date"
        />
      </Col>
    </FormGroup>

    <FormGroup row>
      <Label for="symbol" sm={labelSize}>Symbol</Label>
      <Col sm={inputSize}>
        <Input
          type="text"
          name="symbol"
          id="symbol"
          value={props.currentState.symbol[0]}
          onChange={event => props.sendFormValue(event)}
          {...props.validity('symbol')}
          autoComplete="off"
        />
      </Col>
    </FormGroup>

    <FormGroup row>
      <Label for="direction" sm={labelSize}>Direction</Label>
      <Col sm={inputSize}>
        <Input
          type="select"
          name="direction"
          id="direction"
          value={props.currentState.direction[0]}
          onChange={event => props.sendFormValue(event)}
        >
          <option>Long</option>
          <option>Short</option>
        </Input>
      </Col>
    </FormGroup>

    <FormGroup row>
      <Label for="price" sm={labelSize}>Price</Label>
      <Col sm={inputSize}>
        <Input
          type="text"
          name="price"
          id="price"
          value={props.currentState.price[0]}
          onChange={event => props.sendFormValue(event)}
          {...props.validity('price')}
          autoComplete="off"
        />
      </Col>
    </FormGroup>
    <FormGroup row>
      <Label for="positionsize" sm={labelSize}>Size</Label>
      <Col sm={inputSize}>
        <Input
          type="text"
          name="size"
          id="positionsize"
          value={props.currentState.size[0]}
          onChange={event => props.sendFormValue(event)}
          {...props.validity('size')}
          autoComplete="off"
        />
      </Col>
    </FormGroup>

    <FormGroup row>
      <Label for="stop" sm={labelSize}>Stop</Label>
      <Col sm={inputSize}>
        <Input
          type="text"
          name="stop"
          id="stop"
          value={props.currentState.stop[0]}
          onChange={event => props.sendFormValue(event)}
          {...props.validity('stop')}
          autoComplete="off"
        />
      </Col>
    </FormGroup>

    <FormGroup row>
      <Label for="comments" sm={labelSize}>Notes</Label>
      <Col sm={inputSize}>
        <Input
          type="text"
          name="comments"
          id="comments"
          value={props.currentState.comments[0]}
          onChange={event => props.sendFormValue(event)}
          {...props.validity('comments')}
          autoComplete="off"
        />
      </Col>
    </FormGroup>
  </Form>
);

EntryForm.propTypes = {
  sendFormValue: PropTypes.func.isRequired,
  onDateFocus: PropTypes.func.isRequired,
  validity: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
  date: PropTypes.objectOf(PropTypes.any).isRequired,
  currentState: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default EntryForm;
