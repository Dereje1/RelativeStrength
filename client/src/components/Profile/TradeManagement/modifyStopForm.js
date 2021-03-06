// dumb component displays stop move form
import React from 'react';
import PropTypes from 'prop-types';

import {
  Col, Form, FormGroup, Label, Input,
} from 'reactstrap';

const ModifyStopForm = ({
  loading, sendStopValue, formVal, validity,
}) => (
  !loading
    ? (
      <Form>
        <FormGroup row>
          <Label for="stop" sm={2}>New Stop</Label>
          <Col sm={10}>
            <Input
              type="text"
              name="moveStop"
              id="stop"
              value={formVal[0]}
              onChange={event => sendStopValue(event)}
              {...validity()}
              autoComplete="off"
            />
          </Col>
        </FormGroup>
      </Form>
    )
    : <div className="Loading" />
);

ModifyStopForm.propTypes = {
  formVal: PropTypes.arrayOf(PropTypes.any).isRequired,
  sendStopValue: PropTypes.func.isRequired,
  validity: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
export default ModifyStopForm;
