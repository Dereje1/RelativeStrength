// displays event zoom modal
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import moment from 'moment';
import './styles/modalzoom.scss';

class Zoom extends Component {

  constructor(props) {
    super(props);
    // initialize modal show state to false
    this.state = {
      show: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { message } = this.props;
    if ((prevProps.message === false) && (message === true)) {
      this.open();
    }
  }

  close = () => {
    // note my modified modal now sends a reset callback after closing modalstate which clears
    // the message field
    const { reset } = this.props;
    this.setState({
      show: false,
    }, () => reset());
  }

  open() {
    this.setState({
      show: true,
    });
  }

  processCalendar() { // gets calendar detail events and formats for modal
    // filter all event currency for those that match with clicked
    const { zoomInfo, currency } = this.props;
    const filtered = zoomInfo.filter(n => n.country === currency);
    const formatted = filtered.map((n, idx) => {
      const gmtDateTime = moment.utc(n.date);
      // moment.fromNow() computes when the event is to take place
      const happens = gmtDateTime.utc().fromNow();
      return (
        <p key={`${n.country}${idx + 1}`} className="event">
          {n.title}
          <span className="time">
            {`${happens}`}
          </span>
        </p>
      );
    });
    return <div>{formatted}</div>;
  }

  render() {
    const { currency } = this.props;
    const { show } = this.state;
    return (
      <Modal
        isOpen={show}
        toggle={this.close}
      >
        <ModalHeader>
          <span className="currency">
            {currency}
          </span>
          {' - High Impact Events Coming Up This Week'}
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
