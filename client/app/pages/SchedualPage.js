import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { IconMenu, TextField, IconButton, SelectField, MenuItem, DatePicker, Dialog, FloatingActionButton, RaisedButton, FlatButton, Table, TableHeader, TableBody, TableHeaderColumn, TableRow, TableRowColumn, Paper } from 'material-ui'
import { grey500, cyan500 } from 'material-ui/styles/colors'
import ContentAdd from 'material-ui/svg-icons/content/add';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import moment from 'moment'

import { loadScheduals, loadTeacherScheduals } from '../actions/schedualActions'
import LoadingProgress from '../components/LoadingProgress'

import ImageNavigateBefore from 'material-ui/svg-icons/image/navigate-before';
import ImageNavigateNext from 'material-ui/svg-icons/image/navigate-next';
import { validSchedualData } from '../utils/validators'

import Timer from '../utils/timer'
import N18 from '../constants/string'
import DateTimeFormat from '../constants/format'

const styles = {
  top2: {
    marginTop: 30
  },
  toolbar: {
    background: cyan500,
    padding: 10
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
    marginBottom: 5
  },
  class : {
    color: 'white',
    fontSize: 12
  }
}

class SchedualPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      currentDate: new Date(),
    }

    this.nextWeek = this.nextWeek.bind(this);
    this.prevWeek = this.prevWeek.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  //根据不同的角色载入课程表
  loadData(monday, sunday, callback) {
    let isStudent = this.props.user.role == 'student';
    if (isStudent) {
      this.props.loadScheduals(this.props.user.class._id, monday, sunday).then(
        callback,
        err => { }
      );
    } else {
      this.props.loadTeacherScheduals(this.props.user._id, monday, sunday).then(callback)
    }
  }

  componentWillMount() {
    let today = new Date();
    let monday = Timer.getYmd(Timer.showWeekFirstDay(today));
    let sunday = Timer.getYmd(Timer.showWeekLastDay(today));

    this.loadData(monday, sunday, res => {
      this.setState({
        isLoading: false,
      })
    });
  }

  nextWeek() {
    let monday = Timer.getYmd(Timer.nextMonday(this.state.currentDate));
    let sunday = Timer.getYmd(Timer.nextSunday(this.state.currentDate));
    this.setState({ isLoading: true })

    this.loadData(monday, sunday, res => {
      this.setState({
        isLoading: false,
        currentDate: Timer.nextMonday(this.state.currentDate)
      })
    });
  }

  prevWeek() {
    let monday = Timer.getYmd(Timer.lastMonday(this.state.currentDate));
    let sunday = Timer.getYmd(Timer.lastSunday(this.state.currentDate));
    this.setState({ isLoading: true })

    this.loadData(monday, sunday, res => {
      this.setState({
        isLoading: false,
        currentDate: Timer.lastMonday(this.state.currentDate)
      })
    });
  }

  render() {
    const indexs = ['index1', 'index2', 'index3', 'index4', 'index5', 'index6', 'index7', 'index8'];

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

    let isStudent = this.props.user.role == 'student';

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
          </center>
        </div>
        <div className='box' >
          {this.state.isLoading ? <LoadingProgress /> :
            <Table selectable={false}>
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
                    <TableRow style={{ height: 80 }} key={index}>
                      <TableRowColumn>{N18['index' + index]}</TableRowColumn>
                      {
                        week.map(day => {
                          let hasCourse = schedualWithIndex[index] && schedualWithIndex[index][day];
                          if (hasCourse) {
                            let sch = schedualWithIndex[index][day];

                            let col = (<TableRowColumn key={index + day} style={{ background: sch.course.color, textAlign: 'center', cursor: 'pointer', height: 80 }}>
                              <div style={styles.course}>{sch.course.name}</div>
                              <div style={styles.teacher}>{sch.course.teacher && sch.course.teacher.name}</div>
                              <div style={styles.class}>{sch.class && N18.getClasss(sch.class.grade, sch.class.name)}</div>
                            </TableRowColumn>);

                            if (isStudent) {
                              return col;
                            } else {
                              return (
                                <Link to={'/checkUp/' + sch._id + '/' + sch.class._id} style={{ textDecoration: 'none' }}>
                                  {col}
                                </Link>
                              )
                            }
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

export default connect(mapStateToProps, { loadScheduals, loadTeacherScheduals })(SchedualPage)