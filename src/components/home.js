"use strict" //home page for both authorized and unauthorized users
import React, { Component } from 'react';
import axios from 'axios'
import moment from 'moment'
import Strength from './rstrength'
class Home extends Component {
  constructor(props) {
    super(props);
    this.state={
      data:[],
      highImpact:[]
    }
  }
  componentDidMount() {
    axios.get('/api/getraw')
    .then((response)=>{
      this.setState({
        data:[response.data],
        highImpact:this.filterEvents(response.data.weeklyevents.event)
      })
    })
  }
  filterEvents(events){
    let fEvents = (events).filter((e)=>{
      let eDay = e.date[0]
      let eTime=e.time[0]
      let when = eDay + "," + eTime
      let elapsed = moment(when,"MM-DD-YYYY,h:mmA").diff(moment())
      return (elapsed>0 && e.impact[0]==="High")
    })
    return (fEvents)
  }

  render() {

    if(!this.state.data.length){
      return (
        null
      );
    }
    else{
      return(
        <div>
          <Strength alldata={this.state} timeframe="24 hourly bars"/>
          <Strength alldata={this.state} timeframe="168 hourly bars"/>
          <Strength alldata={this.state} timeframe="Past Year"/>
        </div>
      )
    }
  }

}

export default Home;
