// displays event zoom modal
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import './css/modalzoom.css';

class Zoom extends Component {

  constructor(props) {
    super(props);
    // initialize modal show state to false
    this.state = {
      show: false,
    };
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.message === false) && (this.props.message === true)) {
      this.open();
    }
  }

  open() {
    this.setState({
      show: true,
    });
  }

  close = () => {
    // note my modified modal now sends a reset callback after closing modalstate which clears
    // the message field
    this.setState({
      show: false,
    }, () => this.props.reset());
  }

  processCalendar() { // gets calendar detail events and formats for modal
    // filter all event currency for those that match with clicked
    const filtered = this.props.zoomInfo.filter(n =>
      n.country[0] === this.props.currency);
    const formatted = filtered.map((n, idx) => {
      const eDay = n.date[0];
      const eTime = n.time[0];
      const when = `${eDay},${eTime}`;
      const gmtDateTime = moment.utc(when, 'MM-DD-YYYY,h:mmA');
      // momemnet from now computes when the event is to take place
      const happens = gmtDateTime.utc().fromNow();
      return (
        <p key={`${n.country[0]}${idx + 1}`} className="event">{n.title[0]}<span className="time"> {`${happens}`}</span></p>
      );
    });
    return <div>{formatted}</div>;
  }

  render() {
    return (
      <Modal
        isOpen={this.state.show}
        toggle={this.close}
      >
        <ModalHeader>
          <span className="currency">{this.props.currency}</span> - High Impact Events Coming Up This Week
        </ModalHeader>
        <ModalBody id="mbody">
          {this.processCalendar()}
        </ModalBody>
        <ModalFooter id="zoomfooter" />
      </Modal>
    );
  }

}

Zoom.defaultProps = {
  message: false,
  reset: {},
  zoomInfo: [],
  currency: '',
};

Zoom.propTypes = {
  message: PropTypes.bool,
  reset: PropTypes.func,
  zoomInfo: PropTypes.arrayOf(PropTypes.shape),
  currency: PropTypes.string,
};
export default Zoom;
