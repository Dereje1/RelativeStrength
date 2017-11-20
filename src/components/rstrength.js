import React, { Component } from 'react';

class Strength extends Component {
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
      return (
          <div key={idx} id="Card">
            <div id="symbol">{symbol}</div>
            <div id="strength">{strength}</div>
            <div id="events">{this.symbolEvents(symbol).length}</div>
          </div>
      )
    }))
  }
  render() {
    return (
      <div>
        <h4 className="title">{this.props.timeframe}</h4>
        <div id="mainframe">
          {this.buildData()}
        </div>
      </div>
    );
  }

}

export default Strength;
