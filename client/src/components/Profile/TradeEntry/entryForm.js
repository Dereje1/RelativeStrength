// dumb component to display entry form
import React from 'react';
import PropTypes from 'prop-types';
// react dates
import { SingleDatePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
// bootstrap
import { Input } from 'reactstrap';

const EntryForm = props => (
  <React.Fragment>
    <div className="formLabels">
      <span>Date</span>
      <span>Symbol</span>
    </div>
    <div className="dateSymbol">
      <div id="Trade_Entry_Date">
        <SingleDatePicker
          date={props.date} // momentPropTypes.momentObj or null
          onDateChange={date => props.sendFormValue(date)} // PropTypes.func.isRequired
          focused={props.focused} // PropTypes.bool
          onFocusChange={() => props.onDateFocus()} // PropTypes.func.isRequired
          numberOfMonths={1}
          isOutsideRange={() => false}
          block
        />
      </div>
      <Input
        type="text"
        name="symbol"
        id="symbol"
        value={props.currentState.symbol[0]}
        onChange={event => props.sendFormValue(event)}
        {...props.validity('symbol')}
        autoComplete="off"
      />
    </div>
    <div className="formLabels">
      <span>Direction</span>
      <span>Price <strong>{props.currentState.lastPrice}</strong></span>
    </div>
    <div className="directionPrice">
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
      <Input
        type="text"
        name="price"
        id="price"
        value={props.currentState.price[0]}
        onChange={event => props.sendFormValue(event)}
        {...props.validity('price')}
        autoComplete="off"
      />
    </div>
    <div className="formLabels">
      <span>Size</span>
      <span>Stop</span>
    </div>
    <div className="sizeStop">
      <Input
        type="text"
        name="size"
        id="positionsize"
        value={props.currentState.size[0]}
        onChange={event => props.sendFormValue(event)}
        {...props.validity('size')}
        autoComplete="off"
      />
      <Input
        type="text"
        name="stop"
        id="stop"
        value={props.currentState.stop[0]}
        onChange={event => props.sendFormValue(event)}
        {...props.validity('stop')}
        autoComplete="off"
      />
    </div>
    <div className="formLabels">
      <span>Notes</span>
    </div>
    <div className="comments">
      <Input
        type="textarea"
        name="comments"
        id="comments"
        value={props.currentState.comments[0]}
        onChange={event => props.sendFormValue(event)}
        {...props.validity('comments')}
        autoComplete="off"
      />
    </div>
    <div className="riskDisplay">
      <strong>
        {
          props.risk ?
            `${props.risk}`
            :
            null
        }
      </strong>
    </div>
  </React.Fragment>

);

EntryForm.defaultProps = {
  risk: null,
};

EntryForm.propTypes = {
  sendFormValue: PropTypes.func.isRequired,
  onDateFocus: PropTypes.func.isRequired,
  validity: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
  date: PropTypes.objectOf(PropTypes.any).isRequired,
  currentState: PropTypes.objectOf(PropTypes.any).isRequired,
  risk: PropTypes.string,
};

export default EntryForm;
