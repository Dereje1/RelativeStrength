"use strict" //displays event zoom modal
import React, { Component } from 'react';
import {Button,Modal} from 'react-bootstrap'
import moment from 'moment'
class Zoom extends Component {
  constructor(props) {
    super(props)
    //initialize modal show state to false
    this.state={
      show:false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if((prevProps.message===false)&&(this.props.message===true)){
      this.setState({
        show:true
      })
    }
  }
  open(){
  this.setState({
    show:true
  })
  }
  close(){
    //note my modified modal now sends a reset callback after closing modalstate which clears
    //the message field
    this.setState({
      show: false
    },()=>this.props.reset());
  }

  processCalendar(){//gets calendar detail events and formats for modal
    let filtered=this.props.zoomInfo.filter((n)=>{//filter all event currency for those that match with clicked
      return n.country[0]===this.props.currency
    })
    let formatted=filtered.map((n,idx)=>{
      let eDay = n.date[0]
      let eTime=n.time[0]
      let when = eDay + "," + eTime
      var gmtDateTime = moment.utc(when, "MM-DD-YYYY,h:mmA")
      let happens = gmtDateTime.utc().fromNow()//momemnet from now computes when the event is to take place
      return(
        <p key={idx} className="event">{n.title[0]}<span className="time"> {"  " + happens}</span></p>
      )
    })
    return <div>{formatted}</div>
  }
  render() {
    return (
      <Modal
        show={this.state.show}
        onHide={this.close.bind(this)}
        container={this}
        aria-labelledby="contained-modal-title"
      >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-zoom">
          <span className="currency">{this.props.currency}</span> - High Impact Events Coming Up This Week
        </Modal.Title>
      </Modal.Header>
      <Modal.Body id="mbody">
        {this.processCalendar()}
      </Modal.Body>
      <Modal.Footer id="zoomfooter">
      </Modal.Footer>
    </Modal>
    );
  }

}

export default Zoom;
