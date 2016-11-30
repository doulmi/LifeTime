import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppBar } from 'material-ui'

import Navbar from '../components/Navbar'
import { logoutRequest } from '../actions/authActions'
import withWidth, { MEDIUM, LARGE } from 'material-ui/utils/withWidth'

const styles = {
  container: {},
  root: {}
}

class MainPage extends Component {
  constructor(props) {
    super(props);

    let width = props.width;
    if (width == MEDIUM || width == LARGE) {
      styles.container.paddingLeft = 180;
      styles.root = {
        width: '96%', position: 'relative', margin: 'auto'
      }

      this.state = {
        openDrawer: true,
        docked: true
      }
    } else {
      styles.container.paddingLeft = 0;
      this.state = {
        openDrawer: false,
        docked: false
      }
    }
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  openDrawer() {
    this.setState({
      openDrawer: true
    })
  }

  closeDrawer() {
    this.setState({
      openDrawer: false
    })
  }

  toggleDrawer(open) {
    this.setState({
      openDrawer: open
    })
  }

  render() {
    const defaultValue = this.context.router.location.pathname;

    return (
      <div style={styles.container} >
        <AppBar
          className="hidden-sm hidden-md hidden-lg"
          title=""
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonTouchTap={this.openDrawer}
          />
        <Navbar
          user={this.props.auth.user}
          logoutRequest={this.props.logoutRequest}
          open={this.state.openDrawer}
          docked={this.state.docked}
          defaultValue={defaultValue}
          toggleDrawer={this.toggleDrawer}
          />
        <div style={styles.root}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

MainPage.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default connect(mapStateToProps, { logoutRequest })(withWidth()(MainPage));