"use strict" //displays pin zoom modal
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

  processCalendar(){
    let filtered=this.props.zoomInfo.filter((n)=>{
      return n.country[0]===this.props.currency
    })
    let formatted=filtered.map((n,idx)=>{
      let eDay = n.date[0]
      let eTime=n.time[0]
      let when = eDay + "," + eTime
      var gmtDateTime = moment.utc(when, "MM-DD-YYYY,h:mmA")
      let happens = gmtDateTime.local().fromNow()
      return(
        <p key={idx}>{n.title[0] + " - " + happens}</p>
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
          {this.props.currency} High Impact Events Coming Up This Week
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {this.processCalendar()}
      </Modal.Body>
      <Modal.Footer id="zoomfooter">
      </Modal.Footer>
    </Modal>
    );
  }

}

export default Zoom;
