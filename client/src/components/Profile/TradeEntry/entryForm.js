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
      <Label for="symbol" sm={labelSize}>Symbol</Label>
      <Col sm={inputSize}>
        <Input
          type="text"
          name="symbol"
          id="symbol"
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
          onChange={event => props.sendFormValue(event)}
        >
          <option>Long</option>
          <option>Short</option>
        </Input>
      </Col>
    </FormGroup>
    <FormGroup row>
      <Label for="stop" sm={labelSize}>Stop</Label>
      <Col sm={inputSize}>
        <Input
          type="text"
          name="stop"
          id="stop"
          onChange={event => props.sendFormValue(event)}
          {...props.validity('stop')}
          autoComplete="off"
        />
      </Col>
    </FormGroup>
    <FormGroup row>
      <Label for="entrydate" sm={labelSize}>Date</Label>
      <Col sm={inputSize}>
        <SingleDatePicker
          date={props.date} // momentPropTypes.momentObj or null
          onDateChange={date => props.sendFormValue(date)} // PropTypes.func.isRequired
          focused={props.focused} // PropTypes.bool
          onFocusChange={() => props.onDateFocus()} // PropTypes.func.isRequired
          numberOfMonths={1}
          id="Trade_Entry_Date"
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
          onChange={event => props.sendFormValue(event)}
          {...props.validity('size')}
          autoComplete="off"
        />
      </Col>
    </FormGroup>
    <FormGroup row>
      <Label for="price" sm={labelSize}>Price</Label>
      <Col sm={inputSize}>
        <Input
          type="text"
          name="price"
          id="price"
          onChange={event => props.sendFormValue(event)}
          {...props.validity('price')}
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
          onChange={event => props.sendFormValue(event)}
          {...props.validity('comments')}
          autoComplete="off"
        />
      </Col>
    </FormGroup>
  </Form>
);

EntryForm.defaultProps = {
  sendFormValue: {},
  onDateFocus: {},
  validity: {},
  focused: false,
  date: {},
};

EntryForm.propTypes = {
  sendFormValue: PropTypes.func,
  onDateFocus: PropTypes.func,
  validity: PropTypes.func,
  focused: PropTypes.bool,
  date: PropTypes.objectOf(PropTypes.any),
};

export default EntryForm;
