import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Snackbar, FlatButton, RaisedButton, FloatingActionButton, TextField, Paper, Dialog, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, SelectField, MenuItem, IconMenu, IconButton } from 'material-ui'

import { cyan500, cyan700, grey500, grey900 } from 'material-ui/styles/colors'
import NavigationArrowBack from 'material-ui/svg-icons//navigation/arrow-back'
import { loadStudentsByClass } from '../../actions/studentActions'
import { loadScoresByClass } from '../../actions/scoreActions'
import { loadCourseById } from '../../actions/courseActions'
import { saveScores } from '../../actions/scoreActions'
import { loadCheckUpByClass } from '../../actions/checkActions'
import ActionDone from 'material-ui/svg-icons/action/done';

import LoadingProgress from '../../components/LoadingProgress'
import N18 from '../../constants/string'

const styles = {
  top3: {
    marginTop: 30
  },
  toolbar: {
    padding: 10,
    background: cyan500,
  },
  buttons: {
    marginTop: 5
  }
}

class GiveScorePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.goBack = this.goBack.bind(this);
    this.saveAll = this.saveAll.bind(this);
    this.changeScore = this.changeScore.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  componentWillMount() {
    this.props.loadStudentsByClass(this.props.params.classId);
    this.props.loadCourseById(this.props.params.courseId);
    this.props.loadScoresByClass(this.props.params.classId, this.props.params.courseId);
    this.props.loadCheckUpByClass(this.props.params.classId, this.props.params.courseId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.scores.length > 0) {
      let scores = {};
      nextProps.scores.map(score => {
        scores[score.student] = score.note
      })
      this.setState(scores)
    }
  }

  handleRequestClose() {
    this.setState({
      open: false
    })
  }

  changeScore(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  saveAll() {
    let scores = this.state;
    let courseId = this.props.params.courseId;
    delete scores['open'];
    delete scores['message'];

    this.props.saveScores(courseId, scores).then(
      res => {
        this.setState({ open: true, message: N18.saveSuccess })
      },
      err => {
        this.setState({ open: true, message: N18.saveFail })
      }
    )
  }

  //回退
  goBack() {
    this.context.router.goBack();
  }

  render() {
    return (
      <Paper>
        <div style={styles.toolbar}>
          <IconButton tooltip={N18.back} onTouchTap={this.goBack} >
            <NavigationArrowBack color="white" />
          </IconButton>

          <div className="pull-right" style={styles.buttons}>
            <RaisedButton
              label={N18.save}
              primary={true}
              onTouchTap={this.saveAll}
              />
          </div>
        </div>
        {this.props.isLoading ? <LoadingProgress /> :
          <div className="box">
            <h1>{this.props.course.name}</h1>
            <Table selectable={false}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                <TableRow selectable={false}>
                  <TableHeaderColumn >{N18.userId}</TableHeaderColumn>
                  <TableHeaderColumn >{N18.name}</TableHeaderColumn>
                  <TableHeaderColumn >{N18.checks}</TableHeaderColumn>
                  <TableHeaderColumn >{N18.score}</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false} showRowHover={true}>
                {this.props.students && this.props.students.map(student => (
                  <TableRow key={student._id}>
                    <TableRowColumn>{student.userId}</TableRowColumn>
                    <TableRowColumn>{student.name}</TableRowColumn>
                    <TableRowColumn>{this.props.studentChecks[student._id]}</TableRowColumn>
                    <TableRowColumn>
                      <TextField hintText={N18.score} name={student._id} fullWidth={true} value={this.state[student._id]} onChange={this.changeScore} />
                    </TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        }
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
          />
      </Paper>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    students: state.students.students,
    isLoading: state.students.isLoading,
    scores: state.scores.scores,
    course: state.courses.course,
    studentChecks: state.checks.studentChecks
  }
}

GiveScorePage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, { loadCourseById, loadStudentsByClass, loadScoresByClass, saveScores, loadCheckUpByClass })(GiveScorePage)