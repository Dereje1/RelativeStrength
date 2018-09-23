// root of the frontend get /set primary store vars here
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Landing from './components/Landing/landing';
import Header from './components/Header/header';

// action gets user info on every mount of this component
import getUser from './actions/authentication';
import { getForexData, setForexData } from './actions/mt4fetch';

// import data utilities
import { mt4LastPush } from './utilitiy/index';
import getForexHours from './utilitiy/tradehours';
import Constants from './constants/index';

const { MT4_UPDATE_CYCLE, CLIENT_CHECK_INTERVAL } = Constants;

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      secondsSinceUpdate: 0, // seconds since last mt4 Update
      fxOpenCeters: {},
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
      if (mt4LastPush(this.props.forexData.aws.updated) < MT4_UPDATE_CYCLE) this.updateForexData();
      else {
        this.setState({
          secondsSinceUpdate: mt4LastPush(this.props.forexData.aws.updated),
          fxOpenCeters: getForexHours(),
        });
      }
    }

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
      fxOpenCeters: getForexHours(),
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
          openCenters={this.state.fxOpenCeters}
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

Main.defaultProps = {
  getUser: {},
  getForexData: {},
  setForexData: {},
  forexData: {},
  user: {},
};

Main.propTypes = {
  getUser: PropTypes.func,
  getForexData: PropTypes.func,
  setForexData: PropTypes.func,
  forexData: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
};
export default connect(mapStateToProps, mapDispatchToProps)(Main);
