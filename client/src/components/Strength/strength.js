// Landing page for both authorized and unauthorized users
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import StrengthTables from './strengthtables'; // displays strenngth data for different tfs
import Zoom from './zoom'; // modal zoom for

import './css/strength.css';

const mapStateToProps = state => state;

class Strength extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hovered: '', // Stores hovered currency name
      displayModal: false, // modal show/not show on event click
      currecnyInfo: '',
    };
    this.setTables = this.setTables.bind(this);
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
        <StrengthTables
          alldata={this.props.forexData}
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
    if (Object.keys(this.props.forexData).length) {
      return (
        <div>
          <div id="all">
            {this.setTables()}
          </div>
          <Zoom
            message={this.state.displayModal}
            reset={() => this.setState({ displayModal: false })}
            currency={this.state.currecnyInfo}
            zoomInfo={this.props.forexData.highImpact}
          />
        </div>
      );
    }
    return null;
  }

}

Strength.defaultProps = {
  forexData: {},
};

Strength.propTypes = {
  forexData: PropTypes.objectOf(PropTypes.any),
};

export default connect(mapStateToProps)(Strength);
