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
      currecnyInfo:"",
      secondsSinceUpdate:0
    }
  }
  componentDidMount() {
    if(!this.freshData()){this.updateData()}
    this.Interval = setInterval(()=>{
      this.setState({
        secondsSinceUpdate:this.state.secondsSinceUpdate-1
      })
      if (this.state.secondsSinceUpdate<-1200){//20 minutes = 15 min MT4 + 5 min AWS cycles
        this.updateData()
      }
    },1000)
  }
  componentWillUnmount() {
    clearInterval(this.Interval)
  }
  updateData(){
    axios.get('/api/getraw')
    .then((response)=>{
      this.setState({
        data:[response.data],
        highImpact:this.filterEvents(response.data.weeklyevents.event),
        secondsSinceUpdate:this.mt4LastPush(response.data.updated)
      },()=>this.storeLocal())
    })
  }
  mt4LastPush(lastUpdate){
    //this.state.data[0].updated
    let inSecs = moment(lastUpdate,"YYYY.MM.DD h:mm:ss").diff(moment())/1000
    return Math.floor(inSecs)
  }
  storeLocal(){
    localStorage.setItem('fullState', JSON.stringify(this.state));
  }
  freshData(){
    if(!localStorage.getItem('fullState')){return false}
    let previousUpdate= JSON.parse(localStorage.getItem('fullState'))
    let elapsedTime = moment(previousUpdate.data[0].updated,"YYYY.MM.DD h:mm:ss").diff(moment())
    if(elapsedTime>-900000){
      previousUpdate.secondsSinceUpdate=this.mt4LastPush(previousUpdate.data[0].updated)
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
      var gmtDateTime = moment.utc(when, "MM-DD-YYYY,h:mmA")
      let elapsed = gmtDateTime.local().diff(moment())
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
            <h4 className="title sub">Updated {Math.floor(-1*this.state.secondsSinceUpdate/60)} Minutes Ago</h4>
          </Well>
          <div id="all">
            <Strength alldata={this.state}
             timeframe="Past 24 Hours"
             hovStart={(d)=>this.startHover(d)}
             hovEnd={(d)=>this.stopHover(d)}
             hoveredSymbol= {this.state.hovered}
             displayEvents={true}
             zoomed={(c)=>this.onZoom(c)}
             />
             <Strength alldata={this.state}
              timeframe="Past 10 Days"
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
            <div id="gitsource"><a href="https://github.com/Dereje1/RelativeStrength" target="_blank"> <i className="fa fa-github" aria-hidden="true"></i> Github</a></div>
        </div>
      )
    }
  }

}

export default Home;
