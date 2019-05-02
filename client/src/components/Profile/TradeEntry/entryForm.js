// dumb component to display entry form
import React from 'react';
import PropTypes from 'prop-types';
// react dates
import { SingleDatePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
// bootstrap
import { Input } from 'reactstrap';

const EntryForm = ({
  date, sendFormValue, focused, onDateFocus, currentState, validity, risk,
}) => (
  <React.Fragment>
    <div className="formLabels">
      <span>Date</span>
      <span>Symbol</span>
    </div>
    <div className="dateSymbol">
      <div id="Trade_Entry_Date">
        <SingleDatePicker
          date={date} // momentPropTypes.momentObj or null
          onDateChange={d => sendFormValue(d)} // PropTypes.func.isRequired
          focused={focused} // PropTypes.bool
          onFocusChange={() => onDateFocus()} // PropTypes.func.isRequired
          numberOfMonths={1}
          isOutsideRange={() => false}
          block
        />
      </div>
      <Input
        type="text"
        name="symbol"
        id="symbol"
        value={currentState.symbol[0]}
        onChange={event => sendFormValue(event)}
        {...validity('symbol')}
        autoComplete="off"
      />
    </div>
    <div className="formLabels">
      <span>Direction</span>
      <span>
        {'Price '}
        <strong>{currentState.lastPrice}</strong>
      </span>
    </div>
    <div className="directionPrice">
      <Input
        type="select"
        name="direction"
        id="direction"
        value={currentState.direction[0]}
        onChange={event => sendFormValue(event)}
      >
        <option>Long</option>
        <option>Short</option>
      </Input>
      <Input
        type="text"
        name="price"
        id="price"
        value={currentState.price[0]}
        onChange={event => sendFormValue(event)}
        {...validity('price')}
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
        value={currentState.size[0]}
        onChange={event => sendFormValue(event)}
        {...validity('size')}
        autoComplete="off"
      />
      <Input
        type="text"
        name="stop"
        id="stop"
        value={currentState.stop[0]}
        onChange={event => sendFormValue(event)}
        {...validity('stop')}
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
        value={currentState.comments[0]}
        onChange={event => sendFormValue(event)}
        {...validity('comments')}
        autoComplete="off"
      />
    </div>
    <div className="riskDisplay">
      <strong>
        {
          risk ? `${risk}` : null
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
