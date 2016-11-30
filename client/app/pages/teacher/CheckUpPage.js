import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Snackbar, FlatButton, RaisedButton, FloatingActionButton, TextField, Paper, Dialog, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, SelectField, MenuItem, IconMenu, IconButton } from 'material-ui'

import { green500, cyan500, cyan700, grey400, grey500, grey900 } from 'material-ui/styles/colors'
import NavigationArrowBack from 'material-ui/svg-icons//navigation/arrow-back'
import { loadStudentsByClass } from '../../actions/studentActions'
import { loadChecksBySchedual, saveChecks } from '../../actions/checkActions'
import { loadSchedualById } from '../../actions/schedualActions'

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

class CheckUpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.goBack = this.goBack.bind(this);
    this.saveAll = this.saveAll.bind(this);
    this.changeCheck = this.changeCheck.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  componentWillMount() {
    this.props.loadStudentsByClass(this.props.params.classId);
    this.props.loadSchedualById(this.props.params.schedualId);
    this.props.loadChecksBySchedual(this.props.params.schedualId);
    this.forceUpdate();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checks.length > 0) {
      let checks = {};
      nextProps.checks.map(check => {
        checks[check.student] = true
      });
      this.setState(checks)
    } else {
      let state = {};
      Object.keys(this.state).map(key => {
        state[key] = false;
      })
      this.setState(state);
    }
  }

  handleRequestClose() {
    this.setState({ open: false })
  }

  changeCheck(studentId) {
    this.setState({ [studentId]: !this.state[studentId] })
  }

  saveAll() {
    let checks = this.state;
    let schedualId = this.props.params.schedualId;
    let classId = this.props.params.classId;
    delete checks['open'];
    delete checks['message'];

    this.props.saveChecks(schedualId, classId, checks).then(
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
            <h1>{this.props.schedual.course && this.props.schedual.course.name}</h1>
            <Table selectable={false}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                <TableRow selectable={false}>
                  <TableHeaderColumn >{N18.userId}</TableHeaderColumn>
                  <TableHeaderColumn >{N18.name}</TableHeaderColumn>
                  <TableHeaderColumn >{N18.check}</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false} showRowHover={true}>
                {this.props.students && this.props.students.map(student => (
                  <TableRow key={student._id}>
                    <TableRowColumn>{student.userId}</TableRowColumn>
                    <TableRowColumn>{student.name}</TableRowColumn>
                    <TableRowColumn>
                      <IconButton onTouchTap={() => this.changeCheck(student._id)}>
                        <ActionDone color={this.state[student._id] ? green500 : grey400} />
                      </IconButton>
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
    checks: state.checks.checks,
    schedual: state.scheduals.schedual
  }
}

CheckUpPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, { loadSchedualById, loadStudentsByClass, loadChecksBySchedual, saveChecks })(CheckUpPage)