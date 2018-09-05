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

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      secondsSinceUpdate: 0, // seconds since last mt4 Update
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
      this.setState({
        secondsSinceUpdate: mt4LastPush(this.props.forexData.aws.updated),
      });
    }

    const checkInterval = 30; // in secs
    this.Interval = setInterval(() => { // start timer interval update every sec
      this.setState({
        secondsSinceUpdate: this.state.secondsSinceUpdate - checkInterval,
      });
      if (this.state.secondsSinceUpdate < -900) { // 20 minutes = 15 min MT4 + 5 min AWS cycles
        this.updateForexData();
      }
    }, checkInterval * 1000);
  }

  updateForexData = async () => {
    if (this.state.secondsSinceUpdate > -900) return;
    await this.props.getForexData();
    localStorage.setItem('forexData', JSON.stringify(this.props.forexData));
    this.setState({
      secondsSinceUpdate: mt4LastPush(this.props.forexData.aws.updated),
    });
  }

  render() {
    if (!Object.keys(this.props.forexData).length) return null;
    return (
      <div>
        <Header
          secondsSinceUpdate={this.state.secondsSinceUpdate}
          loggedIn={this.props.user.authenticated}
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
