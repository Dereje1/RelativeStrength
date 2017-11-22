import React, { Component } from 'react';

class Strength extends Component {
  findClass(d){
    if(d[0]===this.props.hoveredSymbol){
      return "card lit"
    }
    else{
      return "card"
    }
  }
  symbolEvents(symbol){
    let symbEvent = this.props.alldata.highImpact.filter((h)=>{
      return h.country[0]===symbol
    })
    return symbEvent
  }
  buildData(){
    let strengthData = this.props.alldata.data[0][this.props.timeframe]
    return (strengthData.map((d,idx)=>{
      let symbol = d["0"]
      let strength = (Number(d["1"])).toFixed(2)+"%"
      let totalEvents = this.symbolEvents(symbol).length
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
            <div className="events">{totalEvents} Events</div>
          </div>
      )
    }))
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
