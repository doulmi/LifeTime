import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, RaisedButton } from 'material-ui'
import LoginForm from '../components/LoginForm'
import { loginRequest } from '../actions/authActions'
import {cyan500} from 'material-ui/styles/colors'

const styles = {
  top3: {
    height: 150
  },

  top2: {
    height: 100
  },

  form: {
  }
}

class LoginPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { loginRequest } = this.props;
    return (
      <div className="col-md-4 col-md-offset-4 col-lg-4 col-lg-offset-4 col-xs-12 col-sm-6 col-sm-offset-3" >
        <div style={styles.top3} className="hidden-xs" />
        <div style={styles.top2} className="show-xs hidden-sm hidden-md hidden-lg" />
        <LoginForm loginRequest={loginRequest} />
      </div>
    )
  }
}

LoginPage.propTypes = {
  loginRequest: React.PropTypes.func.isRequired
}

export default connect(null, { loginRequest })(LoginPage);