import React, { Component } from 'react'
import { DatePicker, TextField, RaisedButton, FlatButton, Dialog } from 'material-ui'

import N18 from '../constants/string'
import DateTimeFormat from '../constants/format'
import Timer from '../utils/timer'


/**
 * 1. 查看:action = read, punishment, student
 * 2. 新增:action = new, addPunishment, student
 * 3. 修改:action = modify, punishment, student, updatePunishment
 */
class PunishmentDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      punishmentTitle: '',
      punishmentDate: new Date(),
      punishmentContent: '',
      punishmentId: '',
    }

    this.changeDate = this.changeDate.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeText = this.changeText.bind(this);
    this.savePunishment = this.savePunishment.bind(this);
    this.setPunishment = this.setPunishment.bind(this);
  }

  setPunishment(punishment) {
    this.setState({
      punishmentTitle: punishment.title,
      punishmentDate: new Date(punishment.happenAt),
      punishmentContent: punishment.content,
      punishmentId: punishment._id,
    })
  }

  changeDate(useless, date) {
    this.setState({
      punishmentDate: date
    })
  }

  changeText(e) {
    this.setState({
      punishmentContent: e.target.value
    })
  }

  changeTitle(e) {
    this.setState({
      punishmentTitle: e.target.value
    })
  }

  savePunishment() {
    let punishment = {
      happenAt: Timer.getYmd(this.state.punishmentDate),
      title: this.state.punishmentTitle,
      content: this.state.punishmentContent,
      user: this.props.student._id,
    }
    
    if(this.props.action == 'new') {
      this.props.addPunishment(punishment);
    } else if(this.props.action == 'modify') {
      punishment['_id'] = this.state.punishmentId;
      this.props.updatePunishment(punishment);
    }
    
    this.setState({
      punishmentContent : '',
      punishmentDate: new Date(),
      punishmentTitle: '',
      punishmentId: '',
    })
    this.props.closeCallback();
  }

  render() {
    let noModify = this.props.action == 'read'
    
    const punishmentActions = [
      <FlatButton
        label={N18.close}
        primary={true}
        onTouchTap={this.props.closeCallback}
        />,
      noModify ? null : <RaisedButton
        label={this.props.action == 'new' ? N18.new : N18.modify}
        primary={true}
        onTouchTap={this.savePunishment}
        />
    ]

    let title = N18.addPunishment;
    if(this.props.action == 'read')  {
      title = N18.readPunishment;
    } else if(this.props.action == 'modify') {
      title = N18.modifyPunishment;
    }
    return (
      <Dialog
        title={title}
        actions={punishmentActions}
        modal={true}
        open={this.props.open}
        >
        <div className="row">
          <div className="col-md-6 col-sm-6 col-xs-12">
            <TextField
              value={this.props.student.name}
              disabled={true}
              floatingLabelText={N18.studentName}>
            </TextField>
          </div>
          <div className="col-md-6 col-sm-6 col-xs-12">
            <DatePicker
              hintText={N18.punishmentDate}
              autoOk={true}
              floatingLabelText={N18.punishmentDate}
              DateTimeFormat={DateTimeFormat}
              okLabel={N18.ok}
              value={this.state.punishmentDate}
              disabled={noModify}
              fullWidth={true}
              cancelLabel={N18.cancel}
              locale="zh"
              onChange={this.changeDate}
              />
          </div>
        </div>
        <TextField
          hintText={N18.yourPunishmentTitle}
          fullWidth={true}
          disabled={noModify}
          onChange={this.changeTitle}
          value={this.state.punishmentTitle}
          floatingLabelText={N18.yourPunishmentTitle} >
        </TextField>
        <TextField
          hintText={N18.yourPunishmentContent}
          floatingLabelText={N18.yourPunishmentContent}
          onChange={this.changeText}
          disabled={noModify}
          value={this.state.punishmentContent}
          fullWidth={true}
          multiLine={true}
          />
      </Dialog>
    )
  }
}

PunishmentDialog.propTypes = {
  open: React.PropTypes.bool.isRequired,
  student: React.PropTypes.object.isRequired,
  closeCallback: React.PropTypes.func.isRequired,
  action: React.PropTypes.string.isRequired,  //read, modify, new

  addPunishment: React.PropTypes.func,
  updatePunishment: React.PropTypes.func,
}

export default PunishmentDialog