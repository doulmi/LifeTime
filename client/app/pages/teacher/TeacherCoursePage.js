import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import { FlatButton, RaisedButton, FloatingActionButton, TextField, Paper, Dialog, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, SelectField, MenuItem, IconMenu, IconButton } from 'material-ui'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import { cyan500, cyan700, grey500, grey900 } from 'material-ui/styles/colors'
import LoadingProgress from '../../components/LoadingProgress'
import N18 from '../../constants/string'
import { loadTeacherCourses } from '../../actions/courseActions'
const styles = {
  top3: {
    marginTop: 30
  },
}


class TeacherCoursePage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.loadTeacherCourses(this.props.user);
  }

  render() {
    const emptyDisplay = (
      <center style={styles.top3}>
        {N18.noCourses}
      </center>
    );

    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip={N18.more}
        tooltipPosition="bottom-left"
        >
        <MoreVertIcon color={grey500} />
      </IconButton>
    )

    return (
      <Paper>
        {this.props.isLoading ? <LoadingProgress /> :
          <div className="box">
            {this.props.courses.length == 0 ? emptyDisplay :
              <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                  <TableRow selectable={false}>
                    <TableHeaderColumn >{N18.courseName}</TableHeaderColumn>
                    <TableHeaderColumn >{N18.grade}</TableHeaderColumn>
                    <TableHeaderColumn >{N18.hours}</TableHeaderColumn>
                    <TableHeaderColumn >{N18.credits}</TableHeaderColumn>
                    <TableHeaderColumn style={{ width: 80 }}>{N18.giveScore}</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} showRowHover={true}>
                  {this.props.courses && this.props.courses.map(course => (
                    <TableRow key={course._id}>
                      <TableRowColumn>{course.name}</TableRowColumn>
                      <TableRowColumn>{N18.getSemester(course.grade, course.semester)}</TableRowColumn>
                      <TableRowColumn>{course.hours}</TableRowColumn>
                      <TableRowColumn>{course.credits}</TableRowColumn>
                      <TableRowColumn style={{ width: 80 }}>
                        <IconMenu useLayerForClickAway={true} iconButtonElement={iconButtonElement}>
                          {this.props.user.classes && this.props.user.classes.map(cls => (
                            <Link to={'/giveScore/' + cls._id + '/' + course._id }><MenuItem>{N18.getClasss(cls.grade, cls.name)}</MenuItem></Link>
                          ))}
                        </IconMenu>
                      </TableRowColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            }
          </div>
        }
      </Paper>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    courses: state.courses.courses,
    isLoading: state.courses.isLoading,
    user: state.auth.user
  }
}

export default connect(mapStateToProps, { loadTeacherCourses })(TeacherCoursePage)