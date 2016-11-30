import React, { Component } from 'react'
import { DatePicker, TextField, RaisedButton, FlatButton, Dialog } from 'material-ui'

import N18 from '../constants/string'
import DateTimeFormat from '../constants/format'
import Timer from '../utils/timer'


/**
 * 1. 查看:action = read, achievement, student
 * 2. 新增:action = new, addAchievement, student
 * 3. 修改:action = modify, achievement, student, updateAchievement
 */
class AchievementDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      achievementTitle: '',
      achievementDate: new Date(),
      achievementContent: '',
      achievementId: '',
    }

    this.changeDate = this.changeDate.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeText = this.changeText.bind(this);
    this.saveAchievement = this.saveAchievement.bind(this);
    this.setAchievement = this.setAchievement.bind(this);
  }

  setAchievement(achievement) {
    this.setState({
      achievementTitle: achievement.title,
      achievementDate: new Date(achievement.happenAt),
      achievementContent: achievement.content,
      achievementId: achievement._id,
    })
  }

  changeDate(useless, date) {
    this.setState({
      achievementDate: date
    })
  }

  changeText(e) {
    this.setState({
      achievementContent: e.target.value
    })
  }

  changeTitle(e) {
    this.setState({
      achievementTitle: e.target.value
    })
  }

  saveAchievement() {
    let achievement = {
      happenAt: Timer.getYmd(this.state.achievementDate),
      title: this.state.achievementTitle,
      content: this.state.achievementContent,
      user: this.props.student._id,
    }
    
    if(this.props.action == 'new') {
      this.props.addAchievement(achievement);
    } else if(this.props.action == 'modify') {
      achievement['_id'] = this.state.achievementId;
      this.props.updateAchievement(achievement);
    }
    
    this.setState({
      achievementContent : '',
      achievementDate: new Date(),
      achievementTitle: '',
      achievementId: '',
    })
    this.props.closeCallback();
  }

  render() {
    let noModify = this.props.action == 'read'
    
    const achievementActions = [
      <FlatButton
        label={N18.close}
        primary={true}
        onTouchTap={this.props.closeCallback}
        />,
      noModify ? null : <RaisedButton
        label={this.props.action == 'new' ? N18.new : N18.modify}
        primary={true}
        onTouchTap={this.saveAchievement}
        />
    ]

    let title = N18.addAchievement;
    if(this.props.action == 'read')  {
      title = N18.readAchievement;
    } else if(this.props.action == 'modify') {
      title = N18.modifyAchievement;
    }
    return (
      <Dialog
        title={title}
        actions={achievementActions}
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
              hintText={N18.achievementDate}
              autoOk={true}
              floatingLabelText={N18.achievementDate}
              DateTimeFormat={DateTimeFormat}
              okLabel={N18.ok}
              value={this.state.achievementDate}
              disabled={noModify}
              fullWidth={true}
              cancelLabel={N18.cancel}
              locale="zh"
              onChange={this.changeDate}
              />
          </div>
        </div>
        <TextField
          hintText={N18.yourAchievementTitle}
          fullWidth={true}
          disabled={noModify}
          onChange={this.changeTitle}
          value={this.state.achievementTitle}
          floatingLabelText={N18.yourAchievementTitle} >
        </TextField>
        <TextField
          hintText={N18.yourAchievementContent}
          floatingLabelText={N18.yourAchievementContent}
          onChange={this.changeText}
          disabled={noModify}
          value={this.state.achievementContent}
          fullWidth={true}
          multiLine={true}
          />
      </Dialog>
    )
  }
}

AchievementDialog.propTypes = {
  open: React.PropTypes.bool.isRequired,
  student: React.PropTypes.object.isRequired,
  closeCallback: React.PropTypes.func.isRequired,
  action: React.PropTypes.string.isRequired,  //read, modify, new

  addAchievement: React.PropTypes.func,
  updateAchievement: React.PropTypes.func,
}

export default AchievementDialog