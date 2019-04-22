// creates and displays strength data for each currency for any given tf
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Badge } from 'reactstrap';
import './styles/rstrength.scss';

class StrengthTables extends Component {

  findClass(d) { // sets className for hovered symbol
    const { hoveredSymbol } = this.props;
    if (d[0] === hoveredSymbol) return 'cardx lit';
    // USD is base so add different class
    if (d[0] === 'USD') return 'cardx usd';
    return 'cardx';
  }

  symbolEvents(symbol) { // returns all highimpact events for a particular symbol
    const { alldata } = this.props;
    const symbEvent = alldata.highImpact.filter(h => h.country === symbol);
    let soonEvent = false; // checks for events within the next 12 hours
    symbEvent.forEach((ev) => {
      if (!soonEvent) {
        const gmtDateTime = moment(ev.date);
        const elapsed = gmtDateTime.diff(moment.utc());
        soonEvent = (elapsed < 43200000);
      }
    });
    return [symbEvent, soonEvent];
  }

  buildData() {
    const {
      alldata, timeframe, displayEvents,
      hovStart, hovEnd, zoomed,
    } = this.props;
    // extract data for given time frame (tf)
    const strengthData = alldata.aws[timeframe];
    if (displayEvents) { // events are only displayed for shortest (24hr) tf
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
            onMouseEnter={() => hovStart(d)}
            onMouseLeave={() => hovEnd()}
            onClick={() => zoomed([d[0], totalEvents])}
            onKeyDown={() => {}}
            role="presentation"
          >
            <div className="symbol">
              {symbol}
              <span className="strength">
                {strength}
              </span>
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
          onMouseEnter={() => hovStart(d)}
          onMouseLeave={() => hovEnd()}
        >
          <div className="symbol">
            {symbol}
            <span className="strength">
              {strength}
            </span>
          </div>
        </div>
      );
    }));
  }

  render() {
    const { timeframe } = this.props;
    return (
      <div>
        <h6 className="title">{timeframe}</h6>
        <div className="mainframe">
          {this.buildData()}
        </div>
      </div>
    );
  }

}

StrengthTables.defaultProps = {
  hoveredSymbol: '',
  alldata: {},
  timeframe: '',
  displayEvents: false,
  hovStart: {},
  hovEnd: {},
  zoomed: {},
};

StrengthTables.propTypes = {
  hoveredSymbol: PropTypes.string,
  alldata: PropTypes.objectOf(PropTypes.any),
  timeframe: PropTypes.string,
  displayEvents: PropTypes.bool,
  hovStart: PropTypes.func,
  hovEnd: PropTypes.func,
  zoomed: PropTypes.func,
};
export default StrengthTables;
