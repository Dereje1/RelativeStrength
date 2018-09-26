import React, { Component } from 'react';
import PropTypes from 'prop-types';
// custom components
import ClosedTradeDetail from './closedtradedetail';
// bootstrap fontawesom and css
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './css/records.css';

class TradeInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) this.initializeForm();
  }

  initializeForm = () => {
    const emptyForm = {};
    this.setState(emptyForm);
  }

  cancelDetail = () => this.props.onToggle();

  modalBodyRender = () =>
    (
      <ClosedTradeDetail
        trade={this.props.trade}
        fxLastPrices={this.props.fxLastPrices}
      />
    );


  render() {
    if (!Object.keys(this.props.trade).length) return null;
    return (
      <Modal
        isOpen={this.props.show}
        toggle={this.cancelDetail}
      >
        <ModalHeader toggle={this.cancelDetail} className="CustomModalHeader">
          <div>
            {`${this.props.trade.symbol} `}
            <FontAwesomeIcon
              className={this.props.trade.long ? 'directionalArrowUp' : 'directionalArrowDown'}
              icon={this.props.trade.long ? faArrowUp : faArrowDown}
            />
          </div>
        </ModalHeader>
        <ModalBody id="mbody">
          {this.modalBodyRender()}
        </ModalBody>
      </Modal>
    );
  }

}

TradeInfo.propTypes = {
  onToggle: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  trade: PropTypes.objectOf(PropTypes.any).isRequired,
  fxLastPrices: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default TradeInfo;
