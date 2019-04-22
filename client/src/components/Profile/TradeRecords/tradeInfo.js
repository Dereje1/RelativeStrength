import React, { Component } from 'react';
import PropTypes from 'prop-types';
// bootstrap fontawesom and css
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
// custom components
import ClosedTradeDetail from './closedtradedetail';
import './styles/records.scss';

class TradeInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps) {
    const { show } = this.props;
    if (prevProps.show !== show) this.initializeForm();
  }

  initializeForm = () => {
    const emptyForm = {};
    this.setState(emptyForm);
  }

  // eslint-disable-next-line react/destructuring-assignment
  cancelDetail = () => this.props.onToggle();

  modalBodyRender = () => (
    <ClosedTradeDetail
      // eslint-disable-next-line react/destructuring-assignment
      trade={this.props.trade}
      // eslint-disable-next-line react/destructuring-assignment
      fxLastPrices={this.props.fxLastPrices}
    />
  );


  render() {
    const { trade, show } = this.props;
    if (!Object.keys(trade).length) return null;
    return (
      <Modal
        isOpen={show}
        toggle={this.cancelDetail}
      >
        <ModalHeader toggle={this.cancelDetail} className="CustomModalHeader">
          <div>
            {`${trade.symbol} `}
            <FontAwesomeIcon
              className={trade.long ? 'directionalArrowUp' : 'directionalArrowDown'}
              icon={trade.long ? faArrowUp : faArrowDown}
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
