import React, { Component } from 'react';
import PropTypes from 'prop-types';

// bootstrap
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './css/management.css';

import TradeDetail from './tradedetail';

class TradeModification extends Component {

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


  cancelModify = () => this.props.onToggle();

  render() {
    if (!Object.keys(this.props.trade).length) return null;
    return (
      <Modal
        isOpen={this.props.show}
      >
        <ModalHeader >
          <div className="symbol">{`${this.props.trade.symbol} `}
            <FontAwesomeIcon
              className={this.props.trade.long ? 'directionalArrowUp' : 'directionalArrowDown'}
              icon={this.props.trade.long ? faArrowUp : faArrowDown}
            />
          </div>
        </ModalHeader>
        <ModalBody id="mbody">
          <TradeDetail
            trade={this.props.trade}
            fxLastPrices={this.props.fxLastPrices}
          />
        </ModalBody>
        <ModalFooter>
          <Col sm={4}>
            <Button
              color="danger"
              className="float-left"
              onClick={this.cancelModify}
            >Cancel
            </Button>
          </Col>
          <Col sm={4}>
            <Button
              color="danger"
              className="float-left"
              onClick={this.cancelTrade}
            >Move Stop
            </Button>
          </Col>
          <Col sm={4}>
            {this.state.confirm ?
              <Button
                color="success"
                className="float-right"
                onClick={this.enterTrade}
              >Close Trade
              </Button>
              :
              <Button
                color="success"
                className="float-right"
                onClick={this.confirmTrade}
              >Close Trade
              </Button>
            }
          </Col>
        </ModalFooter>
      </Modal>
    );
  }

}

TradeModification.propTypes = {
  onToggle: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  trade: PropTypes.objectOf(PropTypes.any).isRequired,
  fxLastPrices: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default TradeModification;
