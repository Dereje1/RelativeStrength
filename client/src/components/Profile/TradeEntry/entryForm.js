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
        />
      </Col>
    </FormGroup>
    <FormGroup row>
      <Label for="direction" sm={labelSize}>Direction</Label>
      <Col sm={inputSize}>
        <Input
          type="select"
          name="long"
          id="direction"
          onChange={event => props.sendFormValue(event)}
        >
          <option>true</option>
          <option>false</option>
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
        />
      </Col>
    </FormGroup>
    <FormGroup row>
      <Label for="symbol" sm={labelSize}>Date</Label>
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
        />
      </Col>
    </FormGroup>
    <FormGroup row>
      <Label for="comments" sm={labelSize}>Comments</Label>
      <Col sm={inputSize}>
        <Input
          type="text"
          name="comments"
          id="comments"
          onChange={event => props.sendFormValue(event)}
        />
      </Col>
    </FormGroup>
  </Form>
);

EntryForm.defaultProps = {
  sendFormValue: {},
  onDateFocus: {},
  focused: false,
  date: {},
};

EntryForm.propTypes = {
  sendFormValue: PropTypes.func,
  onDateFocus: PropTypes.func,
  focused: PropTypes.bool,
  date: PropTypes.objectOf(PropTypes.any),
};

export default EntryForm;
