// dumb component displays trade exit form
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

const AddPositionForm = props => (
  !props.loading ?
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
            id="Trade_Exit_Date"
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
            value={props.price}
            onChange={event => props.sendFormValue(event)}
            {...props.validity('price')}
            autoComplete="off"
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label for="size" sm={labelSize}>Size</Label>
        <Col sm={inputSize}>
          <Input
            type="text"
            name="size"
            id="positionsize"
            value={props.size}
            onChange={event => props.sendFormValue(event)}
            {...props.validity('size')}
            autoComplete="off"
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label for="stop" sm={2}>New Stop</Label>
        <Col sm={10}>
          <Input
            type="text"
            name="moveStop"
            id="stop"
            value={props.stop}
            onChange={event => props.sendFormValue(event)}
            {...props.validity('moveStop')}
            autoComplete="off"
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label for="comments" sm={labelSize}>Notes</Label>
        <Col sm={inputSize}>
          <Input
            type="textarea"
            name="comments"
            id="comments"
            value={props.comments}
            onChange={event => props.sendFormValue(event)}
            {...props.validity('comments')}
            autoComplete="off"
          />
        </Col>
      </FormGroup>
      <Label for="risk" className="riskDisplay" sm={12}>
        <strong>
          {
            props.risk ?
              `Open Risk: $${props.risk.newRisk}
             Cost Basis: ${props.risk.newCostBasis[1]}
             Position Size: ${props.risk.newCostBasis[0]}`
              :
              null
          }
        </strong>
      </Label>
    </Form>
    :
    <div className="Loading" />
);

AddPositionForm.defaultProps = {
  risk: null,
};

AddPositionForm.propTypes = {
  sendFormValue: PropTypes.func.isRequired,
  onDateFocus: PropTypes.func.isRequired,
  validity: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
  date: PropTypes.objectOf(PropTypes.any).isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  stop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  comments: PropTypes.string.isRequired,
  risk: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.bool.isRequired,
};

export default AddPositionForm;
