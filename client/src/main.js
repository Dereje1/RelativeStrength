// root of the frontend get /set primary store vars here
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
// redux and actions
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import getUser from './actions/authentication';
import { getForexData, setForexData } from './actions/mt4fetch';
// Components
import Navigation from './components/Navigation/navigation';
// utilities and constants
import { mt4LastPush, getForexHours } from './utilitiy/fxAndMt4';
import Constants from './constants/index';


const { MT4_UPDATE_CYCLE, CLIENT_CHECK_INTERVAL } = Constants;

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      secondsSinceUpdate: 0,
      fxOpenCenters: {},
    };
  }

  componentDidMount() {
    console.log('CDM Mounted for Main');
    this.initialize();
  }

  componentWillUnmount() {
    clearInterval(this.Interval);
  }

  getLoadingClass = () => {
    if ((this.state.secondsSinceUpdate - MT4_UPDATE_CYCLE) < -600) return 'Loading dataupdate mt4Down';
    return 'Loading dataupdate fx';
  }

  initialize = async () => {
    await this.props.getUser();

    if (!localStorage.getItem('forexData')) { // no local storage data
      this.updateForexData();
    } else {
      await this.props.setForexData(); // set store with locally stored data
      // check if current data has expired
      if (mt4LastPush(this.props.forexData.aws.updated) < MT4_UPDATE_CYCLE) this.updateForexData();
      else {
        this.setState({
          secondsSinceUpdate: mt4LastPush(this.props.forexData.aws.updated),
          fxOpenCenters: getForexHours(),
        });
      }
    }
    // start client interval
    this.Interval = setInterval(() => {
      this.setState({
        secondsSinceUpdate: this.state.secondsSinceUpdate - CLIENT_CHECK_INTERVAL,
      });
      if (this.state.secondsSinceUpdate < MT4_UPDATE_CYCLE) {
        this.updateForexData();
      }
    }, CLIENT_CHECK_INTERVAL * 1000);
  }

  updateForexData = async () => {
    await this.props.getForexData();
    localStorage.setItem('forexData', JSON.stringify(this.props.forexData));
    this.setState({
      secondsSinceUpdate: mt4LastPush(this.props.forexData.aws.updated),
      fxOpenCenters: getForexHours(),
    });
  }

  header = () =>
    (
      <div className="header">
        <div className="description">
          {this.state.secondsSinceUpdate < MT4_UPDATE_CYCLE ?
            <div className={this.getLoadingClass()} />
            :
            null
          }
          {
            <div className="forexHours">
              <div className={`center ${this.state.fxOpenCenters.NEWYORK}`}>New York</div>
              <div className={`center ${this.state.fxOpenCenters.LONDON}`}>London</div>
              <div className={`center ${this.state.fxOpenCenters.TOKYO}`}>Tokyo</div>
              <div className={`center ${this.state.fxOpenCenters.SYDNEY}`}>Sydney</div>
            </div>
          }
        </div>
        <Navigation
          authenticated={this.props.user.authenticated}
        />
      </div>
    )

  render() {
    if (!Object.keys(this.props.forexData).length) return <div className="Loading" />;
    if (!this.state.secondsSinceUpdate) return <div className="Loading" />;
    return this.header();
  }

}


const mapStateToProps = state => state;
const mapDispatchToProps = dispatch =>
  bindActionCreators({
    getUser,
    getForexData,
    setForexData,
  }, dispatch);

Main.propTypes = {
  getUser: PropTypes.func.isRequired,
  getForexData: PropTypes.func.isRequired,
  setForexData: PropTypes.func.isRequired,
  forexData: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
