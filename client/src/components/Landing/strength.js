// creates and displays strength data for each currency for any given tf
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Badge } from 'reactstrap';
import './css/rstrength.css';

class Strength extends Component {

  findClass(d) { // sets className for hovered symbol
    if (d[0] === this.props.hoveredSymbol) return 'cardx lit';
    // USD is base so add different class
    if (d[0] === 'USD') return 'cardx usd';
    return 'cardx';
  }

  symbolEvents(symbol) { // returns all highimpact events for a particular symbol
    const symbEvent = this.props.alldata.highImpact.filter(h => h.country[0] === symbol);
    let soonEvent = false; // check for events within the next 24 hours
    symbEvent.forEach((ev) => {
      if (!soonEvent) {
        const eDay = ev.date[0];
        const eTime = ev.time[0];
        const when = `${eDay},${eTime}`;
        const gmtDateTime = moment.utc(when, 'MM-DD-YYYY,h:mmA');
        const elapsed = gmtDateTime.diff(moment.utc());
        soonEvent = (elapsed < 43200000);
      }
    });
    return [symbEvent, soonEvent];
  }

  buildData() {
    // extract data for given time frame (tf)
    const strengthData = this.props.alldata.aws[this.props.timeframe];
    if (this.props.displayEvents) { // events are only displayed for shortest (24hr) tf
      return (strengthData.map((d, idx) => { // parse thru each symbol
        const symbol = d['0'];
        const strength = `${(Number(d['1'])).toFixed(2)}%`;
        const events = this.symbolEvents(symbol);
        const totalEvents = events[0].length; // total # of events for symbol
        const eventClass = events[1] ? 'events soon' : 'events';
        return (
          <div
            key={`${symbol}${idx + 1}`}
            className={this.findClass(d)}
            onMouseEnter={() => this.props.hovStart(d)}
            onMouseLeave={() => this.props.hovEnd()}
            onClick={() => this.props.zoomed([d[0], totalEvents])}
            onKeyDown={() => {}}
            role="presentation"
          >
            <div className="symbol">{symbol}
              <span className="strength"> {strength}</span>
            </div>
            <Badge className={eventClass}>{totalEvents || null}</Badge>
          </div>
        );
      }));
    }

    return (strengthData.map((d, idx) => {
      const symbol = d['0'];
      const strength = `${(Number(d['1'])).toFixed(2)}%`;
      return (
        <div
          key={`${symbol}${idx + 1}`}
          className={this.findClass(d)}
          onMouseEnter={() => this.props.hovStart(d)}
          onMouseLeave={() => this.props.hovEnd()}
        >
          <div className="symbol">{symbol}
            <span className="strength"> {strength}</span>
          </div>
        </div>
      );
    }));
  }

  render() {
    return (
      <div>
        <h6 className="title">{this.props.timeframe}</h6>
        <div className="mainframe">
          {this.buildData()}
        </div>
      </div>
    );
  }

}

Strength.defaultProps = {
  hoveredSymbol: '',
  alldata: {},
  timeframe: '',
  displayEvents: false,
  hovStart: {},
  hovEnd: {},
  zoomed: {},
};

Strength.propTypes = {
  hoveredSymbol: PropTypes.string,
  alldata: PropTypes.objectOf(PropTypes.any),
  timeframe: PropTypes.string,
  displayEvents: PropTypes.bool,
  hovStart: PropTypes.func,
  hovEnd: PropTypes.func,
  zoomed: PropTypes.func,
};
export default Strength;
