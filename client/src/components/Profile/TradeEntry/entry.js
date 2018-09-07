import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// bootstrap
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import EntryForm from './entryForm';
import postNewTrade from '../../../utilitiy/orders';

class TradeEntry extends Component {

  constructor(props) {
    super(props);
    this.state = {
      symbol: '',
      long: true,
      date: moment(),
      stop: 0,
      size: 0,
      price: 0,
      comments: '',
      dateFocus: false,
    };
  }

  processNewTrade = (event) => {
    if (Object.prototype.hasOwnProperty.call(event, '_isAMomentObject')) {
      this.setState({
        date: event,
      });
      return;
    }
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });

    // console.log(name, value)
  }

 submitTrade = () => {
   const tradeModel = {
     userId: this.props.userId,
     tradeStatusOpen: true, // true = Open
     symbol: this.state.symbol,
     long: this.state.long, // true = long
     stop: this.state.stop,
     entry: [
       {
         date: Date.parse(this.state.date._d),
         size: this.state.size,
         price: this.state.price,
         comments: this.state.comments,
       },
     ],
   };
   postNewTrade(tradeModel);
 }

 render() {
   return (
     <Modal
       isOpen={this.props.show}
     >
       <ModalHeader >
         Trade Entry
       </ModalHeader>
       <ModalBody id="mbody">
         <EntryForm
           sendFormValue={fv => this.processNewTrade(fv)}
           date={this.state.date}
           focused={this.state.dateFocus}
           onDateFocus={() => this.setState({ dateFocus: !this.state.dateFocus })}
         />
       </ModalBody>
       <ModalFooter>
         <Col sm={6}>
           <Button
             color="danger"
             className="float-left"
             onClick={this.props.onToggle}
           >Cancel
           </Button>
         </Col>
         <Col sm={6}>
           <Button
             color="success"
             className="float-right"
             onClick={this.submitTrade}
           >Enter Trade
           </Button>
         </Col>
       </ModalFooter>
     </Modal>
   );
 }

}

export default TradeEntry;
