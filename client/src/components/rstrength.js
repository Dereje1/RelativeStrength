//creates and displays strength data for each currency for any given tf
import React, { Component } from 'react';
import moment from 'moment'

class Strength extends Component {
  findClass(d){//sets className for hovered symbol
    if(d[0]===this.props.hoveredSymbol){
      return "card lit"
    }
    else{
      //USD is base so add different class
      if(d[0]==="USD"){return "card usd"}
      return "card"
    }
  }
  symbolEvents(symbol){//returns all highimpact events for a particular symbol
    let symbEvent = this.props.alldata.highImpact.filter((h)=>{
      return h.country[0]===symbol
    })
    let soonEvent = false; //check for events within the next 24 hours
    symbEvent.forEach((ev)=>{
      if(!soonEvent){
        let eDay = ev.date[0]
        let eTime=ev.time[0]
        let when = eDay + "," + eTime
        var gmtDateTime = moment.utc(when, "MM-DD-YYYY,h:mmA")
        let elapsed = gmtDateTime.diff(moment.utc())
        soonEvent = (elapsed < 43200000) ? true : false
      }
    })
    return [symbEvent,soonEvent]
  }
  buildData(){
    let strengthData = this.props.alldata.data[0][this.props.timeframe] //extract data for given time frame (tf)
    if (this.props.displayEvents){//events are only displayed for shortest (24hr) tf
      return (strengthData.map((d,idx)=>{//parse thru each symbol
        let symbol = d["0"]
        let strength = (Number(d["1"])).toFixed(2)+"%"
        let events = this.symbolEvents(symbol)
        let totalEvents = events[0].length //total # of events for symbol
        let displayEvent = totalEvents>0 ? (totalEvents>1 ? totalEvents + " Events" : "1 Event") :""
        let eventClass = events[1] ? "events soon" : "events"
        return (
            <div key={idx}
             className={this.findClass(d)}
             onMouseEnter={()=>this.props.hovStart(d)}
             onMouseLeave={()=>this.props.hovEnd()}
             onClick={()=>this.props.zoomed([d[0],totalEvents])}
             >
              <div className="symbol">{symbol}
                <span className="strength"> {strength}</span>
              </div>
              <div className={eventClass}>{displayEvent}</div>
            </div>
        )
      }))
    }
    else{
      return (strengthData.map((d,idx)=>{
        let symbol = d["0"]
        let strength = (Number(d["1"])).toFixed(2)+"%"
        return (
            <div key={idx}
             className={this.findClass(d)}
             onMouseEnter={()=>this.props.hovStart(d)}
             onMouseLeave={()=>this.props.hovEnd()}
             >
              <div className="symbol">{symbol}
                <span className="strength"> {strength}</span>
              </div>
            </div>
        )
      }))
    }

  }
  render() {
    return (
      <div>
        <h4 className="title">{this.props.timeframe}</h4>
        <div className="mainframe">
          {this.buildData()}
        </div>
      </div>
    );
  }

}

export default Strength;
