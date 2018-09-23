// root of the frontend get /set primary store vars here
import React from 'react';
import PropTypes from 'prop-types';
// redux and actions
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import getUser from './actions/authentication';
import { getForexData, setForexData } from './actions/mt4fetch';
// Components
import Landing from './components/Landing/landing';
import Header from './components/Header/header';
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

  render() {
    if (!Object.keys(this.props.forexData).length) return <div className="Loading" />;
    if (!this.state.secondsSinceUpdate) return <div className="Loading" />;
    return (
      <div>
        <Header
          secondsSinceUpdate={this.state.secondsSinceUpdate}
          loggedIn={this.props.user.authenticated}
          openCenters={this.state.fxOpenCenters}
        />
        <Landing />
      </div>
    );
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
export default connect(mapStateToProps, mapDispatchToProps)(Main);
