import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Snackbar, Dialog, FlatButton, IconButton, DatePicker, Paper, TextField, RaisedButton } from 'material-ui'

import { updateUserInfo, modifyPassword } from '../actions/userActions'
import DateTimeFormat from '../constants/format'
import ActionVisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import ActionVisibility from 'material-ui/svg-icons/action/visibility';

import N18 from '../constants/string'
import { validUserInfoData, validModifyPassword } from '../utils/validators'

class InfoPage extends Component {
  constructor(props) {
    super(props);

    let user = this.props.user;
    this.state = {
      _id: user._id,
      name: user.name,
      sex: user.sex,
      class: N18.getClasss(user.grade, user.class),
      birthday: new Date(user.birthday),
      phone: user.phone,
      password: '',
      open: false,
      errors: {},
      oldPassword: '',
      address: user.address,
      type: 'password',

      //snackbar
      show: false,
      message: ''
    }

    this.toggleVisible = this.toggleVisible.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.changeText = this.changeText.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.closeSnackbar = this.closeSnackbar.bind(this);
  }

  closeSnackbar() {
    this.setState({
      show: false
    })
  }

  openDialog() {
    this.setState({
      open: true
    })
  }
  closeDialog() {
    this.setState({
      open: false
    })
  }

  changeText(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  changeDate(useless, date) {
    this.setState({
      birthday: date
    })
  }

  toggleVisible() {
    if (this.state.type == 'password') {
      this.setState({ type: 'text' });
    } else {
      this.setState({ type: 'password' });
    }
  }

  changePassword() {
    let user = {
      _id: this.props.user._id,
      password: this.state.password,
      oldPassword: this.state.oldPassword,
    }

    let { errors, isValid } = validModifyPassword(user);
    if (isValid) {
      this.props.modifyPassword(user).then(
        (res) => {
          this.setState({ open: false, newPassword: '', password: '', show: true, message: N18.modifyPasswordSuccess })
        },
        (err) => {
          this.setState({ show: true, message: N18.modifyPasswordFail })
        }
      );

      this.setState({
        errors: {},
        password: '',
        oldPassword: '',
      })
    }
  }

  updateUserInfo() {
    let user = {
      _id: this.props.user._id,
      password: this.state.password,
      oldPassword: this.state.oldPassword,
      birthday: this.state.birthday,
      phone: this.state.phone,
      address: this.state.address
    }

    let { errors, isValid } = validUserInfoData(user);

    if (isValid) {
      this.props.updateUserInfo(user).then(
        res => {
          this.setState({ show: true, message: N18.updateUserSuccess, errors: {} })
        },
        err => {
          this.setState({ show: false, message: N18.updateUserFail })
        })
    } else {
      this.setState({ errors })
    }
  }

  render() {

    const actions = [
      <FlatButton
        label={N18.close}
        primary={true}
        onTouchTap={this.closeDialog}
        />,
      <RaisedButton
        label={N18.submit}
        primary={true}
        onTouchTap={this.changePassword}
        />
    ]

    const dialog = (
      <Dialog
        title={N18.changePassword}
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.closeDialog}
        >
        <TextField
          hintText={N18.oldPassword}
          value={this.state.oldPassword}
          fullWidth={true}
          name='oldPassword'
          type={this.state.type}
          onChange={this.changeText}
          errorText={this.state.errors.oldPassword}
          floatingLabelText={N18.oldPassword} />

        <TextField
          hintText={N18.newPassword}
          value={this.state.password}
          type={this.state.type}
          name='password'
          style={{ width: 'calc(100% - 60px)' }}
          onChange={this.changeText}
          errorText={this.state.errors.newPassword}
          floatingLabelText={N18.newPassword} >
        </TextField>

        <IconButton onTouchTap={this.toggleVisible}>
          {this.type == 'password' ? <ActionVisibility /> : <ActionVisibilityOff />}
        </IconButton>

      </Dialog>
    )

    return (
      <Paper>
        <div className="box">
          <div className="pull-right">
            <RaisedButton
              label={N18.changePassword}
              secondary={true}
              onTouchTap={this.openDialog}
              />
          </div>
          <TextField
            hintText={N18.id}
            value={this.state._id}
            fullWidth={true}
            disabled={true}
            errorText={this.state.errors.id}
            floatingLabelText={N18.id} />

          <TextField
            hintText={N18.name}
            value={this.state.name}
            disabled={true}
            fullWidth={true}
            errorText={this.state.errors.name}
            floatingLabelText={N18.name} />

          <TextField
            hintText={N18.sex}
            value={this.state.sex == 'M' ? N18.male : N18.female}
            disabled={true}
            fullWidth={true}
            errorText={this.state.errors.sex}
            floatingLabelText={N18.sex} />

          {this.props.user.role == 'student' && <TextField
            hintText={N18.class}
            value={this.state.class}
            disabled={true}
            fullWidth={true}
            errorText={this.state.errors.class}
            floatingLabelText={N18.class} />}

          <DatePicker
            hintText={N18.birthday}
            floatingLabelText={N18.birthday}
            DateTimeFormat={DateTimeFormat}
            okLable={N18.ok}
            autoOk={true}
            value={this.state.birthday}
            fullWidth={true}
            cancelLabel={N18.cancel}
            locale='zh'
            onChange={this.changeDate}
            />

          <TextField
            hintText={N18.phone}
            value={this.state.phone}
            onChange={this.changeText}
            fullWidth={true}
            name='phone'
            errorText={this.state.errors.phone}
            floatingLabelText={N18.phone} />

          <TextField
            hintText={N18.address}
            value={this.state.address}
            fullWidth={true}
            onChange={this.changeText}
            name='address'
            errorText={this.state.errors.address}
            floatingLabelText={N18.address} />

          <div>
            <RaisedButton
              label={N18.submit}
              primary={true}
              onTouchTap={this.updateUserInfo}
              />
          </div>
        </div>
        {dialog}

        <Snackbar
          open={this.state.show}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.closeSnackbar}
          />
      </Paper>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}

export default connect(mapStateToProps, { updateUserInfo, modifyPassword })(InfoPage)