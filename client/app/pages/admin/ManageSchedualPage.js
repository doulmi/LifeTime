import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IconMenu, TextField, IconButton, SelectField, MenuItem, DatePicker, Dialog, FloatingActionButton, RaisedButton, FlatButton, Table, TableHeader, TableBody, TableHeaderColumn, TableRow, TableRowColumn, Paper } from 'material-ui'
import { grey500, cyan500 } from 'material-ui/styles/colors'
import ContentAdd from 'material-ui/svg-icons/content/add';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import moment from 'moment'

import { loadScheduals, deleteSchedual, addSchedual, updateSchedual } from '../../actions/schedualActions'
import { loadAllCourses } from '../../actions/courseActions'
import LoadingProgress from '../../components/LoadingProgress'

import ImageNavigateBefore from 'material-ui/svg-icons/image/navigate-before';
import ImageNavigateNext from 'material-ui/svg-icons/image/navigate-next';
import { validSchedualData } from '../../utils/validators'

import Timer from '../../utils/timer'
import N18 from '../../constants/string'
import DateTimeFormat from '../../constants/format'

const styles = {
  top2: {
    marginTop: 30
  },
  toolbar: {
    background: cyan500,
    padding: 10
  },
  buttons: {
    float: 'right',
    marginTop: 28
  },
  center: {
    textAlign: 'center'
  },
  course: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white'
  },
  teacher: {
    color: 'white',
    fontSize: 12,
  }
}

class ManageSchedualPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      currentDate: new Date(),
      errors: {},

      //dialog
      open: false,
      course: '',
      index: 1,
      date: new Date(),
      _id: '',
      isEdit: false
    }

    this.createSchedual = this.createSchedual.bind(this);
    this.editSchedual = this.editSchedual.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.nextWeek = this.nextWeek.bind(this);
    this.prevWeek = this.prevWeek.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.changeIndex = this.changeIndex.bind(this);
    this.changeCourse = this.changeCourse.bind(this);
    this.addSchedual = this.addSchedual.bind(this);
    this.deleteSchedual = this.deleteSchedual.bind(this);
  }

  componentWillMount() {
    if (this.props.scheduals == undefined || this.props.scheduals.length == 0) {
      let today = new Date();
      let monday = Timer.getYmd(Timer.showWeekFirstDay(today));
      let sunday = Timer.getYmd(Timer.showWeekLastDay(today));

      this.props.loadScheduals(this.props.params.classId, monday, sunday).then(
        res => {
          this.setState({
            isLoading: false,
            classId: this.props.params.classId
          })
        },
        err => { }
      );
      this.props.loadAllCourses();
    } else {
      this.setState({
        isLoading: false
      })
    }
  }

  deleteSchedual() {
    this.props.deleteSchedual({ _id: this.state._id });
    this.setState({
      open: false,
    })
  }

  createSchedual() {
    this.setState({
      title: N18.new,
      open: true,
      isEdit: false,
      course: '',
      index: 1,
      _id: '',
    })
  }

  editSchedual(schedual) {
    this.setState({
      title: N18.modify,
      open: true,
      _id: schedual._id,
      course: schedual.course._id,
      index: schedual.index,
      date: new Date(schedual.date),
      isEdit: true
    })
  }

  addSchedual() {
    let schedual = {
      class: this.props.params.classId,
      course: this.state.course,
      date: this.state.date,
      index: this.state.index,
      _id: this.state._id
    }
    let {errors, isValid} = validSchedualData(schedual);
    if (isValid) {
      if (this.state.isEdit) {
        this.props.updateSchedual(schedual).then(
          res => {
            this.setState({
              errors: {},
              open: false
            })
          }
        )
      } else {
        this.props.addSchedual(schedual).then(
          res => {
            this.setState({
              errors: {},
              open: false
            })
          }
        )
      }
    } else {
      this.setState({ errors });
    }
  }

  closeDialog() {
    this.setState({ open: false })
  }

  changeIndex(event, index, value) {
    this.setState({ index: value });
  }

  changeCourse(event, index, value) {
    this.setState({ course: value });
  }

  changeDate(useless, date) {
    this.setState({ date: date });
  }

  nextWeek() {
    let monday = Timer.getYmd(Timer.nextMonday(this.state.currentDate));
    let sunday = Timer.getYmd(Timer.nextSunday(this.state.currentDate));

    this.props.loadScheduals(this.props.params.classId, monday, sunday).then(
      res => {
        this.setState({
          isLoading: false,
          classId: this.props.params.classId,
          currentDate: Timer.nextMonday(this.state.currentDate)
        })
      },
      err => { }
    );
  }

  prevWeek() {
    let monday = Timer.getYmd(Timer.lastMonday(this.state.currentDate));
    let sunday = Timer.getYmd(Timer.lastSunday(this.state.currentDate));

    this.props.loadScheduals(this.props.params.classId, monday, sunday).then(
      res => {
        this.setState({
          isLoading: false,
          classId: this.props.params.classId,
          currentDate: Timer.lastMonday(this.state.currentDate)
        })
      },
      err => { }
    );
  }

  render() {
    let isAdmin = this.props.user.role == 'admin' || this.props.user.role == 'superAdmin'

    const actions = [
      this.state.isEdit && <RaisedButton
        label={N18.delete}
        secondary={true}
        onTouchTap={this.deleteSchedual} />,
      <FlatButton
        label={N18.close}
        primary={true}
        onTouchTap={this.closeDialog}
        />,
      <RaisedButton
        label={N18.submit}
        primary={true}
        onTouchTap={this.addSchedual} />,
    ]

    const indexs = ['index1', 'index2', 'index3', 'index4', 'index5', 'index6', 'index7', 'index8'];
    const dialog = (
      <Dialog
        title={this.state.isEdit ? N18.modify : N18.new}
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.closeDialog}
        >

        <SelectField
          hintText={N18.course}
          value={this.state.course}
          errorText={this.state.errors.course}
          fullWidth={true}
          onChange={this.changeCourse}
          floatingLabelText={N18.course}
          >
          {this.props.courses.map(course => (
            <MenuItem value={course._id} primaryText={course.name} />
          ))}
        </SelectField>

        <DatePicker
          hintText={N18.date}
          floatingLabelText={N18.date}
          DateTimeFormat={DateTimeFormat}
          okLabel={N18.ok}
          autoOk={true}
          fullWidth={true}
          value={this.state.date}
          fullWidth={true}
          cancelLabel={N18.cancel}
          locale="zh"
          onChange={this.changeDate}
          />

        <SelectField
          floatingLabelText={N18.index}
          value={this.state.index}
          fullWidth={true}
          onChange={this.changeIndex}
          >
          {indexs.map((index, i) => (
            <MenuItem value={i + 1} primaryText={N18[index]} />
          ))}
        </SelectField>
      </Dialog>
    )

    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip={N18.more}
        tooltipPosition="bottom-left"
        >
        <MoreVertIcon color={grey500} />
      </IconButton>
    )

    let schedualWithIndex = {};

    this.props.scheduals && this.props.scheduals.map(schedual => {
      if (schedualWithIndex[schedual.index] == undefined) {
        schedualWithIndex[schedual.index] = {};
      }
      schedual.date = Timer.getYmd(schedual.date);
      schedualWithIndex[schedual.index][schedual.date] = schedual;
    })

    this.schedualWithIndex = schedualWithIndex;

    let week = Timer.week(this.state.currentDate);

    this.week = week;
    let ix = [1, 2, 3, 4, 5, 6, 7, 8];

    return (
      <Paper>
        <div style={styles.toolbar}>
          <center>
          <IconButton onTouchTap={this.prevWeek}>
            <ImageNavigateBefore color='white' />
          </IconButton>

          <IconButton onTouchTap={this.nextWeek}>
            <ImageNavigateNext color='white' />
          </IconButton>

          {isAdmin &&
            <span style={styles.buttons}>
              <FloatingActionButton secondary={true} onTouchTap={this.createSchedual} >
                <ContentAdd />
              </FloatingActionButton>
            </span>
          }
          </center>
        </div>
        <div className='box' >
          {this.state.isLoading ? <LoadingProgress /> :
            <Table onCellClick={(rowNumber, columnId) => {
              if(columnId == 0 ) return;
              let hasCourse = this.schedualWithIndex[rowNumber + 1] && this.schedualWithIndex[rowNumber + 1][this.week[columnId - 2]];
              if(hasCourse) {
                let schedual = this.schedualWithIndex[rowNumber + 1][this.week[columnId - 2]];
                this.editSchedual(schedual);
              }
            }} selectable={false}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                <TableRow selectable={false}>
                  <TableHeaderColumn></TableHeaderColumn>
                  <TableHeaderColumn style={styles.center} ><div>{N18.monday}</div>{week[0]}</TableHeaderColumn>
                  <TableHeaderColumn style={styles.center} ><div>{N18.tuesday}</div>{week[1]}</TableHeaderColumn>
                  <TableHeaderColumn style={styles.center} ><div>{N18.wednesday}</div>{week[2]}</TableHeaderColumn>
                  <TableHeaderColumn style={styles.center} ><div>{N18.thursday}</div>{week[3]}</TableHeaderColumn>
                  <TableHeaderColumn style={styles.center} ><div>{N18.friday}</div>{week[4]}</TableHeaderColumn>
                  <TableHeaderColumn style={styles.center} ><div>{N18.saturday}</div>{week[5]}</TableHeaderColumn>
                  <TableHeaderColumn style={styles.center} ><div>{N18.sunday}</div>{week[6]}</TableHeaderColumn>
                </TableRow>
              </TableHeader>

              <TableBody displayRowCheckbox={false} selectable={false} showRowHover={false}>
                {
                  ix.map(index => (
                    <TableRow style={{ height: 80 }}>
                      <TableRowColumn>{N18['index' + index]}</TableRowColumn>
                      {
                        week.map(day => {
                          let hasCourse = schedualWithIndex[index] && schedualWithIndex[index][day];
                          if (hasCourse) {
                            let sch = schedualWithIndex[index][day];
                            return (
                              <TableRowColumn style={{ background: sch.course.color, textAlign: 'center', cursor: 'pointer' }}>
                                <div style={styles.course}>{sch.course.name}</div>
                                <div style={styles.teacher}>{sch.course.teacher && sch.course.teacher.name}</div>
                              </TableRowColumn>
                            )
                          } else {
                            return <TableRowColumn></TableRowColumn>
                          }
                        })
                      }
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          }
        </div>
        {dialog}
      </Paper>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    scheduals: state.scheduals.scheduals,
    user: state.auth.user,
    courses: state.courses.courses,
  }
}
export default connect(mapStateToProps, { loadAllCourses, loadScheduals, deleteSchedual, addSchedual, updateSchedual })(ManageSchedualPage)