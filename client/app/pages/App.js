// @flow
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import LoginPage from './LoginPage'
import MainPage from './MainPage'
import myTheme from './theme'

import injectTapEventPlugin from "react-tap-event-plugin"

injectTapEventPlugin();

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    const {auth} = this.props;
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(myTheme)}>
        {auth.isAuthenticated ? <MainPage>{this.props.children}</MainPage> : <LoginPage />}
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(App)