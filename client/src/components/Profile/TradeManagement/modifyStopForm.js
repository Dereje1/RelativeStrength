// dumb component displays stop move form
import React from 'react';
import PropTypes from 'prop-types';

import { Col, Form, FormGroup, Label, Input } from 'reactstrap';

const ModifyStopForm = props => (
  <Form>
    <FormGroup row>
      <Label for="stop" sm={2}>New Stop</Label>
      <Col sm={10}>
        <Input
          type="text"
          name="movestop"
          id="stop"
          value={props.formVal[0]}
          onChange={event => props.sendStopValue(event)}
          {...props.validity()}
          autoComplete="off"
        />
      </Col>
    </FormGroup>
  </Form>
);

ModifyStopForm.propTypes = {
  formVal: PropTypes.arrayOf(PropTypes.any).isRequired,
  sendStopValue: PropTypes.func.isRequired,
  validity: PropTypes.func.isRequired,
};
export default ModifyStopForm;
