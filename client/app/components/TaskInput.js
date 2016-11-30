import React, { Component } from 'react'

import { Popover, Menu, MenuItem, TimePicker, DatePicker, TextField, Paper, Dialog, RaisedButton, FlatButton, } from 'material-ui'
import { greenA700 } from 'material-ui/styles/colors'
import { CirclePicker } from 'react-color'
import Add from 'material-ui/svg-icons/content/add'
import Stop from 'material-ui/svg-icons/av/stop'

import DateTimeFormat from '../constants/format'
import N18 from '../constants/string'
import Timer from '../utils/timer'
import { validateTask } from '../utils/validators'

const styles = {
  taskInput: {
    padding: 5,
    borderRadius: 2
  },

  actionBar: {
    position: 'relative',
    marginTop: 5
  },

  actionBtn: {
    height: 56,
  },

  actionBtnLabel: {
    heigth: 56,
    fontSize: 18
  },

  duration: {
    marginTop: 7,
    fontSize: 18,
    textAlign: 'center'
  },

  tag: {
    fontSize: 12
  },

  right: {
    textAlign: 'right',
    marginTop: 8,
    fontSize: 16,
    float: 'right'
  },

  tagBtnColor: {
    color: greenA700
  },

  container: {
    padding: 30
  }
}

class TaskInput extends Component {
  constructor(props) {
    super(props);
    this.initTag = {
      name: N18.tag,
      color: styles.tagBtnColor
    }


    this.state = {
      //tag
      tagname: this.initTag.name,
      tagcolor: this.initTag.color,
      tagid: '',
      newTagTex: '',
      newTagColor: '#000000',
      openTagMenu: false,

      //task
      openTagDialog: false,
      taskname: '',
      date: new Date(),
      start: {},
      errors: {},
      stop: {},
      startError: '',
      endError: '',
      tasknameErr: '',
    }

    this.changeTag = this.changeTag.bind(this);
    this.showTagMenu = this.showTagMenu.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.closeTagMenu = this.closeTagMenu.bind(this);
    this.onChangeNewTagColor = this.onChangeNewTagColor.bind(this);
    this.onChangeNewTagText = this.onChangeNewTagText.bind(this);
    this.saveNewTag = this.saveNewTag.bind(this);
    this.onChange = this.onChange.bind(this);
    this.openTagDialog = this.openTagDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.saveTask = this.saveTask.bind(this);
    this.changeStartTime = this.changeStartTime.bind(this);
    this.changeStopTime = this.changeStopTime.bind(this);
    this.changeCurrentTask = this.changeCurrentTask.bind(this);
  }

  componentWillMount() {
    if (this.props.tags.length == 0) {
      this.props.loadTags();
    }
  }

  changeCurrentTask(task) {
    let [year, month, day] = task.date.split('-');
    let [hour1, min1] = task.startAt.split(':');
    let [hour2, min2] = task.stopAt.split(':');

    this.setState({
      taskname: task.text,
      date: new Date(year, month - 1, day),
      start: new Date(year, month - 1, day, hour1, min1),
      stop: new Date(year, month - 1, day, hour2, min2),
      tagname: task.tag != null ? task.tag.name : this.initTag.name,
      tagcolor: task.tag != null ? task.tag.color : this.initTag.color,
      tagid: ''
    });
  }

  changeStopTime(useless, date) {
    this.setState({
      stop: date
    })
  }

  changeStartTime(useless, date) {
    this.setState({
      start: date
    })
  }

  //改变任务的日期
  changeDate(useless, date) {
    this.setState({
      date: date
    });
  }


  //添加新任务
  saveTask() {
    let {errors, isValid} = validateTask(this.state);
    console.log(errors, isValid);
    if (isValid) {
      let start = new Date(this.state.start);
      let stop = new Date(this.state.stop);
      let date = this.state.date;
      let task = {
        text: this.state.taskname,
        date: Timer.getYmd(date),
        startAt: Timer.getTime(start),
        stopAt: Timer.getTime(stop),
        duration: stop.getTime() - start.getTime(),
        created_at: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start.getHours(), start.getMinutes(), start.getSeconds()),
        tag: this.state.tagid
      }

      this.props.stopTask(task);

      this.setState({
        tagname: this.initTag.name,
        tagcolor: this.initTag.color,
        date: new Date(),
        newTagTex: '',
        newTagColor: '#000000',
        openTagMenu: false,
        taskname: '',
        openTagDialog: false,
        errors: {},
        start: {},
        stop: {},
        startError: '',
        endError: '',
        tasknameErr: ''
      })
    } else {
      this.setState({errors});
    }
  }

  //改变任务的标签
  changeTag(tag) {
    this.setState({
      tagname: tag.name,
      tagcolor: tag.color,
      tagid: tag._id,
      openTagDialog: false,
      openTagMenu: false
    })
  }


  //任务内容的输入控制
  onChange(e) {
    this.setState({ taskname: e.target.value });
  }

  //展示tags列表
  showTagMenu(event) {
    event.preventDefault();

    this.setState({
      openTagMenu: true,
      anchorEl: event.currentTarget,
    });
  };

  //关闭tags列表
  closeTagMenu() {
    this.setState({
      openTagMenu: false,
    });
  }

  //改变新建标签的颜色
  onChangeNewTagColor(color) {
    this.setState({
      newTagColor: color.hex
    });
  }

  //改变新建标签的文本
  onChangeNewTagText(e) {
    this.setState({
      newTagText: e.target.value
    })
  }

  //打开新建标签Dialog
  openTagDialog(e) {
    e.preventDefault();
    this.setState({
      newTagText: '',
      newTagColor: '#000000',
      openTagDialog: true,
      openTagMenu: false
    })
  }

  //关闭新建标签Dialog
  closeDialog() {
    this.setState({
      openTagDialog: false,
      openTagMenu: true
    })
  }

  //保存新标签到数据库
  saveNewTag() {
    let newTag = {
      name: this.state.newTagText,
      color: this.state.newTagColor,
    }

    this.props.addTag(newTag);
    this.setState({
      newTagText: '',
      newTagColor: '',

      openNewTagDialog: false,
      openTagDialog: false,
      openTagMenu: true
    })

    // this.changeTag(newTag);
  }

  render() {
    const actions = [
      <FlatButton
        label={N18.cancel}
        primary={true}
        onTouchTap={this.closeDialog}
        />,
      <RaisedButton
        label={N18.new}
        keyboardFocused={true}
        backgroundColor={this.state.newTagColor}
        labelColor='#FFFFFF'
        onTouchTap={this.saveNewTag}
        />,
    ]

    const taskDialog = (
      <Dialog
        title={N18.addTag}
        actions={actions}
        modal={false}
        open={this.state.openTagDialog}
        onRequestClose={this.closeDialog}
        >
        <TextField
          hintText={N18.tagname}
          name="newTagName"
          fullWidth={true}
          floatingLabelText={N18.tagname}
          floatingLabelStyle={{ color: this.state.newTagColor }}
          errorText={this.newTagErro}
          inputStyle={{ color: this.state.newTagColor }}
          onChange={this.onChangeNewTagText}
          value={this.state.newTagText} /><br />
        <CirclePicker width="100%" onChange={this.onChangeNewTagColor} />
      </Dialog>
    );

    let tagsPopover = (
      <Popover
        open={this.state.openTagMenu}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        onRequestClose={this.closeTagMenu}
        >
        <Menu maxHeight={400}>
          <MenuItem
            primaryText={N18.noTag}
            leftIcon={<Stop color="#FFFFFF" />}
            onTouchTap={() => this.changeTag(this.initTag)} />
          {this.props.tags.map(tag => (
            <MenuItem
              key={tag._id}
              primaryText={tag.name}
              onTouchTap={() => this.changeTag(tag)}
              leftIcon={<Stop color={tag.color} />}
              />
          ))}
          <MenuItem primaryText={N18.addTag} leftIcon={<Add color={greenA700} />} onTouchTap={this.openTagDialog} />
        </Menu>
      </Popover>
    );
    return (
      <Paper>
        <div style={styles.container}>
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-12">
              <DatePicker
                hintText={N18.taskDate}
                floatingLabelText={N18.taskDate}
                DateTimeFormat={DateTimeFormat}
                okLabel={N18.ok}
                autoOk={true}
                value={this.state.date}
                fullWidth={true}
                cancelLabel={N18.cancel}
                locale="zh"
                onChange={this.changeDate}
                />
            </div>

            <div className="col-md-4 col-sm-4 col-xs-12">
              <TimePicker
                format="24hr"
                hintText={N18.start}
                fullWidth={true}
                cancelLabel={N18.cancel}
                okLabel={N18.ok}
                floatingLabelText={N18.start}
                errorText={this.state.errors.startError}
                value={this.state.start}
                onChange={this.changeStartTime}
                />
            </div>

            <div className="col-md-4 col-sm-4 col-xs-12">
              <TimePicker
                format="24hr"
                hintText={N18.stop}
                fullWidth={true}
                cancelLabel={N18.cancel}
                okLabel={N18.ok}
                floatingLabelText={N18.stop}
                value={this.state.stop}
                errorText={this.state.errors.stopError}
                onChange={this.changeStopTime}
                />

            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <TextField
                hintText={N18.uDoWhat}
                name='taskname'
                onChange={this.onChange}
                fullWidth={true}
                errorText={this.state.errors.tasknameErr}
                floatingLabelText={N18.uDoWhat}
                value={this.state.taskname}
                />
            </div>

            <div className="col-md-3 col-sm-3 col-xs-12">
              <FlatButton
                style={{ marginTop: 28, width: '100%' }}
                label={this.state.tagname}
                onTouchTap={this.showTagMenu}
                icon={this.state.tagname == this.initTag.name ? <Add /> : <Stop color={this.state.tagcolor} />}
                labelStyle={styles.tag}
                />
            </div>

            <div className="col-md-3 col-sm-3 col-xs-12">
              <RaisedButton
                style={{ marginTop: 28 }}
                label={N18.submit}
                fullWidth={true}
                onTouchTap={this.saveTask}
                primary={true}
                />
            </div>
          </div>
        </div>
        {tagsPopover}
        {taskDialog}
      </Paper>
    )
  }
}


export default TaskInput