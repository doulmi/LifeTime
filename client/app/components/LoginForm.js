import React, { Component } from 'react'
import { TextField, RaisedButton } from 'material-ui'
import { validLoginData } from '../utils/validators'
import { cyan500 } from 'material-ui/styles/colors'
import N18 from '../constants/string'

const styles = {
  loginForm: {
    background: "#FFFFFF",
    padding: "0 40px 40px 40px",
    borderButtomLeftRadius: 10,
    borderButtomRightRadius: 10,
  },

  title: {
    background: cyan500,
    color: "#FFFFFF",
    padding: 40,
    fontSize: 30,
    textAlign: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },

  top1: {
    height: 30
  }
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      password: '',
      errors: [],
      isLoading: false
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }


  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault();

    if (validLoginData(this.state)) {
      this.setState({ isLoading: true })
      this.props.loginRequest(this.state).then(
        (res) => { this.context.router.push('/'); },
        (err) => {
          if (err.response == undefined) {
            this.setState({ errors: { userId: N18.connetFailed }, isLoading: false })
          } else {
            this.setState({ errors: err.response.data.errors, isLoading: false })
          }
        }
      )
    }
  }

  render() {
    const {errors} = this.state;
    return (
      <div>
        <div style={styles.title}>海空飞行员成长记录系统</div>
        <form onSubmit={this.onSubmit} style={styles.loginForm}>
          <TextField
            hintText='账号'
            errorText={errors.userId}
            name='userId'
            value={this.state.userId}
            onChange={this.onChange}
            fullWidth={true}
            floatingLabelText='账号'
            />

          <TextField
            hintText='密码'
            errorText={errors.password}
            name="password"
            value={this.state.password}
            fullWidth={true}
            onChange={this.onChange}
            floatingLabelText='密码'
            type='password'
            />

          <div style={styles.top1}></div>
          <RaisedButton
            label='登录'
            type='submit'
            primary={true}
            fullWidth={true}
            disabled={this.state.isLoading}
            />
        </form>
      </div>
    )
  }
};

LoginForm.propTypes = {
  loginRequest: React.PropTypes.func.isRequired
}

LoginForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default LoginForm