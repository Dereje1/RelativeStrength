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

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      secondsSinceUpdate: 0,
      fxOpenCenters: {},
    };
  }

  componentDidMount() {
    console.log('CDM Mounted for App');
    this.initialize();
  }

  componentWillUnmount() {
    clearInterval(this.Interval);
  }

  getLoadingClass = () => {
    const { secondsSinceUpdate } = this.state;
    return secondsSinceUpdate - MT4_UPDATE_CYCLE < -600
      ? 'Loading dataupdate mt4Down'
      : 'Loading dataupdate fx';
  }

  initialize = async () => {
    const { getUser: getUserStatus, setForexData: updateLocalData } = this.props;
    await getUserStatus();

    if (!localStorage.getItem('forexData')) { // no local storage data
      this.updateForexData();
    } else {
      await updateLocalData(); // set store with locally stored data
      // check if current data has expired
      const { forexData } = this.props;
      if (mt4LastPush(forexData.aws.updated) < MT4_UPDATE_CYCLE) this.updateForexData();
      else {
        this.setState({
          secondsSinceUpdate: mt4LastPush(forexData.aws.updated),
          fxOpenCenters: getForexHours(),
        });
      }
    }
    // start client interval
    this.Interval = setInterval(() => {
      const { secondsSinceUpdate } = this.state;
      this.setState({
        secondsSinceUpdate: secondsSinceUpdate - CLIENT_CHECK_INTERVAL,
      });
      if (secondsSinceUpdate < MT4_UPDATE_CYCLE) {
        this.updateForexData();
      }
    }, CLIENT_CHECK_INTERVAL * 1000);
  }

  updateForexData = async () => {
    const { getForexData: newDataRequest } = this.props;
    await newDataRequest();
    const { forexData } = this.props;
    localStorage.setItem('forexData', JSON.stringify(forexData));
    this.setState({
      secondsSinceUpdate: mt4LastPush(forexData.aws.updated),
      fxOpenCenters: getForexHours(),
    });
  }

  header = () => {
    const { secondsSinceUpdate, fxOpenCenters } = this.state;
    const { user } = this.props;
    return (
      <div className="header">
        <div className="description">
          {
            <div className="forexHours">
              <div className={`center ${fxOpenCenters.NEWYORK}`}>New York</div>
              <div className={`center ${fxOpenCenters.LONDON}`}>London</div>
              {
                secondsSinceUpdate < MT4_UPDATE_CYCLE
                  ? <div className={this.getLoadingClass()} />
                  : null
              }
              <div className={`center ${fxOpenCenters.TOKYO}`}>Tokyo</div>
              <div className={`center ${fxOpenCenters.SYDNEY}`}>Sydney</div>
            </div>
          }
        </div>
        <Navigation
          authenticated={user.authenticated}
        />
      </div>
    );
  }


  render() {
    const { secondsSinceUpdate } = this.state;
    const { forexData } = this.props;
    if (!Object.keys(forexData).length) return <div className="Loading" />;
    if (!secondsSinceUpdate) return <div className="Loading" />;
    return this.header();
  }

}


const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => bindActionCreators({
  getUser,
  getForexData,
  setForexData,
}, dispatch);

App.propTypes = {
  getUser: PropTypes.func.isRequired,
  getForexData: PropTypes.func.isRequired,
  setForexData: PropTypes.func.isRequired,
  forexData: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
