// dumb component displays form to add to position
// called by TradeModification
import React from 'react';
import PropTypes from 'prop-types';
// react dates below
import { SingleDatePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
// bootstrap
import {
  Col, Form, FormGroup, Label, Input,
} from 'reactstrap';

const inputSize = 10;
const labelSize = 2;

const AddPositionForm = ({
  loading, date, sendFormValue, focused,
  onDateFocus, price, validity, size,
  stop, comments, risk,
}) => (
  !loading
    ? (
      <Form>
        <FormGroup row>
          <Label for="entrydate" sm={labelSize}>Date</Label>
          <Col sm={inputSize}>
            <SingleDatePicker
              date={date} // momentPropTypes.momentObj or null
              onDateChange={d => sendFormValue(d)} // PropTypes.func.isRequired
              focused={focused} // PropTypes.bool
              onFocusChange={() => onDateFocus()} // PropTypes.func.isRequired
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
              value={price}
              onChange={event => sendFormValue(event)}
              {...validity('price')}
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
              value={size}
              onChange={event => sendFormValue(event)}
              {...validity('size')}
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
              value={stop}
              onChange={event => sendFormValue(event)}
              {...validity('moveStop')}
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
              value={comments}
              onChange={event => sendFormValue(event)}
              {...validity('comments')}
              autoComplete="off"
            />
          </Col>
        </FormGroup>
        <Label for="risk" className="riskDisplay" sm={12}>
          <strong>
            {
              risk
                ? `Open Risk: $${risk.newRisk}
             Cost Basis: ${risk.newCostBasis[1]}
             Position Size: ${risk.newCostBasis[0]}`
                : null
            }
          </strong>
        </Label>
      </Form>
    )
    : <div className="Loading" />
);

AddPositionForm.defaultProps = {
  risk: null,
};

AddPositionForm.propTypes = {
  // uinified callback for all form values
  sendFormValue: PropTypes.func.isRequired,
  // react dates callbacks and controlled state value
  onDateFocus: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
  date: PropTypes.objectOf(PropTypes.any).isRequired,
  // validation callback
  validity: PropTypes.func.isRequired,
  // price, size, stop, comments controlled state values
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  stop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  comments: PropTypes.string.isRequired,
  // dynamic calculated risk value
  risk: PropTypes.objectOf(PropTypes.any),
  // database updating signal
  loading: PropTypes.bool.isRequired,
};

export default AddPositionForm;
