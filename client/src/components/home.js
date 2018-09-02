// home page for both authorized and unauthorized users
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Well } from 'react-bootstrap';

import Strength from './rstrength'; // displays strenngth data for different tfs
import Zoom from './modalzoom'; // modal zoom for

const mapStateToProps = state => state;

class Home extends Component {

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
        <Strength
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
    const updateInformation = this.props.secondsSinceUpdate < -900 ?
      <h4 className="title expired">Requesting Fresh Data...{-1 * (this.props.secondsSinceUpdate + 900)}s</h4>
      :
      <h4 className="title valid">Updated {(-1 * this.props.secondsSinceUpdate)} Seconds Ago</h4>;

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
          zoomInfo={this.props.forexData.highImpact}
        />
        <div id="gitsource"><a href="https://github.com/Dereje1/RelativeStrength" target="_blank" rel="noopener noreferrer"> <i className="fa fa-github" aria-hidden="true" /> Github</a></div>
      </div>
    );
  }

}

Home.defaultProps = {
  forexData: {},
  secondsSinceUpdate: 0,
};

Home.propTypes = {
  forexData: PropTypes.objectOf(PropTypes.any),
  secondsSinceUpdate: PropTypes.number,
};

export default connect(mapStateToProps)(Home);
