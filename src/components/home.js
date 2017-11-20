"use strict" //home page for both authorized and unauthorized users
import React, { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super(props);
  }
  handleLogin(){
    window.location="/auth/twitter"
  }
  render() {
    return (
      null
    );
  }

}

export default Home;
