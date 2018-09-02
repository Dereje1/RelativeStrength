// home page for both authorized and unauthorized users
import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment'; // neeed for time conversion
import { Well } from 'react-bootstrap';

import Strength from './rstrength'; // displays strenngth data for different tfs
import Zoom from './modalzoom'; // modal zoom for

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [], // for entire data from api
      highImpact: [], // for high impact events
      hovered: '', // Stores hovered currency name
      displayModal: false, // modal show/not show on event click
      currecnyInfo: '',
      secondsSinceUpdate: 0, // seconds since last mt4 Update
    };
    this.setTables = this.setTables.bind(this);
  }
  componentDidMount() {
    // on first mount check if data is new, if not update
    if (!this.freshData()) { this.updateData(); }
    this.Interval = setInterval(() => { // start timer interval update every sec
      this.setState({
        secondsSinceUpdate: this.state.secondsSinceUpdate - 1,
      });
      if (this.state.secondsSinceUpdate < -900) { // 20 minutes = 15 min MT4 + 5 min AWS cycles
        this.updateData();
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.Interval);
  }

  onZoom = (c) => { // on event click to zoom to open madal with events
    if (c[1] === 0) return;
    this.setState({
      displayModal: true,
      currecnyInfo: c[0],
    });
  }

  setTables() {
    return ['Past 24 Hours', 'Past 10 Days', 'Past Year'].map((tf, idx) => {
      const eventDisplay = idx === 0;
      return (
        <Strength
          alldata={this.state}
          key={tf}
          timeframe={tf}
          hovStart={d => this.startHover(d)}
          hovEnd={d => this.stopHover(d)}
          hoveredSymbol={this.state.hovered}
          displayEvents={eventDisplay}
          zoomed={c => this.onZoom(c)}
        />
      );
    });
  }

  updateData() { // use to update the data
    axios.get('/api/getraw')// fetch from backend
      .then((response) => {
      // set state then store state in localStorage
        this.setState({
          data: [response.data],
          highImpact: this.filterEvents(response.data.weeklyevents.event),
          secondsSinceUpdate: this.mt4LastPush(response.data.updated),
        }, () => this.storeLocal());
      });
  }

  mt4LastPush = (lastUpdate) => { // returns the number of seconds since last update
    // let inSecs = moment(lastUpdate,"YYYY.MM.DD h:mm:ss").diff(moment())/1000
    // Changed mt4 to time stamp with gmt instead of eastern
    const gmtUpdateTime = moment.utc(lastUpdate, 'YYYY.MM.DD h:mm:ss');
    // elapsed time in secs since update
    const elapsedSinceUpdate = gmtUpdateTime.diff(moment.utc()) / 1000;
    return Math.floor(elapsedSinceUpdate);
  }

  storeLocal() { // stores state in localStorage
    localStorage.setItem('fullState', JSON.stringify(this.state));
  }

  freshData() { // returns true / false if current data has been updated since last mt4 cycle
    if (!localStorage.getItem('fullState')) { return false; } // if not in local storage then data has never been pulled
    const previousUpdate = JSON.parse(localStorage.getItem('fullState'));// last stored update
    // returns elapsed time in milliseconds from current time
    const elapsedTime = moment(previousUpdate.data[0].updated, 'YYYY.MM.DD h:mm:ss').diff(moment());
    if (elapsedTime > -900000) { // if it has been updated in last 15 minutes data is fresh
      // records the seconds since update and set state
      previousUpdate.secondsSinceUpdate = this.mt4LastPush(previousUpdate.data[0].updated);
      this.setState(previousUpdate);
      return true;
    } // data not fresh
    return false;
  }

  filterEvents = (events) => { // filters high impact events from forex factory
    // events = all events
    const fEvents = (events).filter((e) => {
      const eDay = e.date[0];
      const eTime = e.time[0];
      const when = `${eDay},${eTime}`;
      const gmtDateTime = moment.utc(when, 'MM-DD-YYYY,h:mmA');// ff event data comes in gmt
      const elapsed = gmtDateTime.diff(moment.utc()); // if elapsed < 0 , event has already occured.
      return (elapsed > 0 && e.impact[0] === 'High'); // filter high impact events that have not occured yet
    });
    return (fEvents);
  }

  startHover(d) { // onMouseEnter from Strength component set hovered state to symbol
    this.setState({
      hovered: d[0],
    });
  }

  stopHover() { // onMouseLeave from Strength Component
    this.setState({
      hovered: '',
    });
  }


  render() {
    const updateInformation = this.state.secondsSinceUpdate < -900 ?
      <h4 className="title expired">Requesting Fresh Data...{-1 * (this.state.secondsSinceUpdate + 900)}s</h4>
      :
      <h4 className="title valid">Updated {(-1 * this.state.secondsSinceUpdate)} Seconds Ago</h4>;
    if (!this.state.data.length) return null;

    return (
      <div>
        <Well >
          <h3 className="title"> Relative Strength of Major Currencies Against the USD</h3>
          {updateInformation}
        </Well>
        <div id="all">
          {this.setTables()}
        </div>
        <Zoom
          message={this.state.displayModal}
          reset={() => this.setState({ displayModal: false })}
          currency={this.state.currecnyInfo}
          zoomInfo={this.state.highImpact}
        />
        <div id="gitsource"><a href="https://github.com/Dereje1/RelativeStrength" target="_blank" rel="noopener noreferrer"> <i className="fa fa-github" aria-hidden="true" /> Github</a></div>
      </div>
    );
  }

}

export default Home;