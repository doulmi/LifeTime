import React, { Component } from 'react'
import { TextField, RaisedButton, DatePicker } from 'material-ui'
import DateTimeFormat from '../constants/format'
import N18 from '../constants/string'
import areIntlLocalesSupported from 'intl-locales-supported';
import Timer from '../utils/timer'

import { validOptiqueData } from '../utils/validators'

const styles = {
  row1: {
    height: 30
  }
}

class OptiqueInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optiqueDate: new Date(),
      leftOptique: '',
      rightOptique: '',
      errors: {},
    }

    this.changeDate = this.changeDate.bind(this);
    this.changeLeftOptique = this.changeLeftOptique.bind(this);
    this.changeRightOptique = this.changeRightOptique.bind(this);
    this.saveOptique = this.saveOptique.bind(this);
  }

  changeDate(useless, date) {
    this.setState({
      optiqueDate: date
    })
  }

  changeLeftOptique(e) {
    this.setState({
      leftOptique: e.target.value
    })
  }

  changeRightOptique(e) {
    this.setState({
      rightOptique: e.target.value
    })
  }

  saveOptique() {
    let optique = {
      date: Timer.getYmd(this.state.optiqueDate),
      left: this.state.leftOptique,
      right: this.state.rightOptique
    }

    let {errors, isValid} = validOptiqueData(optique);

    if (isValid) {
      this.props.addOptique(optique);
      this.setState({
        optiqueDate: new Date(),
        leftOptique: '',
        errors: {},
        rightOptique: ''
      })
    } else {
      this.setState({ errors })
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-4 col-sm-4 col-xs-12">
            <DatePicker
              hintText={N18.optiqueDate}
              floatingLabelText={N18.optiqueDate}
              autoOk={true}
              DateTimeFormat={DateTimeFormat}
              okLabel={N18.ok}
              value={this.state.optiqueDate}
              fullWidth={true}
              cancelLabel={N18.cancel}
              locale="zh"
              onChange={this.changeDate}
              />
          </div>

          <div className="col-md-4 col-sm-4 col-xs-12">
            <TextField
              hintText={N18.hintOptique}
              fullWidth={true}
              onChange={this.changeLeftOptique}
              value={this.state.leftOptique}
              errorText={this.state.errors.left}
              floatingLabelText={N18.yourLeftOptique} >
            </TextField>
          </div>

          <div className="col-md-4 col-sm-4 col-xs-12">
            <TextField
              hintText={N18.hintOptique}
              fullWidth={true}
              onChange={this.changeRightOptique}
              value={this.state.rightOptique}
              errorText={this.state.errors.right}
              floatingLabelText={N18.yourRightOptique} >
            </TextField>
          </div>
        </div>

        <div style={styles.row1}></div>
        <RaisedButton
          primary={true}
          label={N18.new}
          onTouchTap={this.saveOptique}
          fullWidth={true}
          />
      </div>
    )
  }
}

OptiqueInput.propTypes = {
  addOptique: React.PropTypes.func.isRequired
}

export default OptiqueInput