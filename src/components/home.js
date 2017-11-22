"use strict" //home page for both authorized and unauthorized users
import React, { Component } from 'react';
import axios from 'axios'
import moment from 'moment'
import Strength from './rstrength'
import Zoom from './modalzoom'
import {Well} from 'react-bootstrap'
class Home extends Component {
  constructor(props) {
    super(props);
    this.state={
      data:[],
      highImpact:[],
      hovered:"",
      hoverClass:"card",
      displayModal:false,
      currecnyInfo:""
    }
  }
  componentDidMount() {
    if(!this.freshData()){
      axios.get('/api/getraw')
      .then((response)=>{
        this.setState({
          data:[response.data],
          highImpact:this.filterEvents(response.data.weeklyevents.event),
        },()=>this.storeLocal())

      })
    }
  }
  storeLocal(){
  localStorage.setItem('fullState', JSON.stringify(this.state));
  }
  freshData(){
    if(!localStorage.getItem('fullState')){return false}
    let previousUpdate= JSON.parse(localStorage.getItem('fullState'))
    let elapsedTime = moment(previousUpdate.data[0].updated,"YYYY.MM.DD h:mm:ss").diff(moment())
    if(elapsedTime>-900000){
      this.setState(previousUpdate)
      return true
    }
    else{
      return false
    }
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
  startHover(d){
    this.setState({
      hovered:d[0]
    })
  }
  stopHover(){
    this.setState({
      hovered:""
    })
  }
  onZoom(c){
    if(c[1]===0){return}
    this.setState({
      displayModal:true,
      currecnyInfo:c[0]
    })
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
          <Well >
            <h3 className="title"> Relative Strength of Major Currencies Against the USD</h3>
            <h4 className="title sub">Updated {moment(this.state.data[0].updated,"YYYY.MM.DD h:mm:ss").fromNow()}</h4>
          </Well>
          <div id="all">
            <Strength alldata={this.state}
             timeframe="Past 24 Hours"
             hovStart={(d)=>this.startHover(d)}
             hovEnd={(d)=>this.stopHover(d)}
             hoveredSymbol= {this.state.hovered}
             zoomed={(c)=>this.onZoom(c)}
             />
             <Strength alldata={this.state}
              timeframe="Past Week"
              hovStart={(d)=>this.startHover(d)}
              hovEnd={(d)=>this.stopHover(d)}
              hoveredSymbol= {this.state.hovered}
              zoomed={(c)=>this.onZoom(c)}
              />
              <Strength alldata={this.state}
               timeframe="Past Year"
               hovStart={(d)=>this.startHover(d)}
               hovEnd={(d)=>this.stopHover(d)}
               hoveredSymbol= {this.state.hovered}
               zoomed={(c)=>this.onZoom(c)}
               />
          </div>
          <Zoom
          message={this.state.displayModal}
          reset={()=>this.setState({displayModal:false})}
          currency={this.state.currecnyInfo}
          zoomInfo={this.state.highImpact}
          />
        </div>
      )
    }
  }

}

export default Home;
