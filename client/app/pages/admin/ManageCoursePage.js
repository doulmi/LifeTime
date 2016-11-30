import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FlatButton, RaisedButton, FloatingActionButton, TextField, Paper, Dialog, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, SelectField, MenuItem, IconMenu, IconButton } from 'material-ui'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ContentAdd from 'material-ui/svg-icons/content/add';
import { cyan500, cyan700, grey500, grey900 } from 'material-ui/styles/colors'
import { CirclePicker } from 'react-color'
import ActionViewQuilt from 'material-ui/svg-icons/action/view-quilt';

import Paginator from '../../components/Paginator'

import SearchBar from '../../components/SearchBar'
import LoadingProgress from '../../components/LoadingProgress'
import AutoSelectField from '../../components/AutoSelectField'

import { updateCourse, loadCourses, deleteCourse, addCourse } from '../../actions/courseActions'
import { loadAllTeachers } from '../../actions/teacherActions'
import {arrangeSchedual} from '../../actions/schedualActions'

import N18 from '../../constants/string'
import { validCourseData } from '../../utils/validators'

const styles = {
  white: {
    color: 'white'
  },
  top3: {
    marginTop: 30
  },
  toolbar: {
    padding: "0 30px 30px 30px",
    background: cyan500,
  },
  floatBtn: {
    float: 'right',
    marginTop: 7
  }
}

class ManageCoursePage extends Component {
  constructor(props) {
    super(props);

    let grade = this.props.location.query.grade;
    let semester = this.props.location.query.semester;
    let search = this.props.location.query.search;

    this.state = {
      //filter
      semester: semester == undefined ? 'all' : semester,
      grade: grade == undefined ? 'all' : grade,
      searchInput: search == undefined ? '' : search,
      errors: {},

      //dialog
      isEdit: false,
      open: false,
      courseGrade: '',
      courseTeacher: '',
      courseName: '',
      courseCode: '',
      courseDesc: '',
      courseSemester: '',
      courseHours: '',
      courseCredits: '',
      dialogTitle: '',
      color: '#000000'
    }

    this.setGrade = this.setGrade.bind(this);
    this.setSemester = this.setSemester.bind(this);
    this.search = this.search.bind(this);
    this.searchCallback = this.searchCallback.bind(this);
    this.clearCallback = this.clearCallback.bind(this);
    this.getQuery = this.getQuery.bind(this);
    this.addCourse = this.addCourse.bind(this);
    this.editCourse = this.editCourse.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.storeCourse = this.storeCourse.bind(this);
    this.onChangeGrade = this.onChangeGrade.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectGrade = this.handleSelectGrade.bind(this);
    this.handleSelectSemester = this.handleSelectSemester.bind(this);
    this.handleSelectTeacher = this.handleSelectTeacher.bind(this);
    this.updateCourse = this.updateCourse.bind(this);
    this.onChangeColor = this.onChangeColor.bind(this);
  }

  componentWillMount() {
    if (this.props.courses == undefined || this.props.courses.length == 0) {
      this.props.loadCourses(0, this.props.location.search);
      this.props.loadAllTeachers();
    }
  }

  onChangeColor(color) {
    this.setState({
      color: color.hex
    })
  }

  onChangeGrade(event, index, value) {
    let course = this.state.course;
    course.grade = value;
    this.setState({ course });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSelectSemester(event, index, value) {
    this.setState({ courseSemester: value })
  }

  handleSelectGrade(event, index, value) {
    this.setState({ courseGrade: value })
  }

  handleSelectTeacher(event, index, value) {
    this.setState({ courseTeacher: value })
  }

  storeCourse() {
    let course = {
      grade: this.state.courseGrade,
      teacher: this.state.courseTeacher,
      name: this.state.courseName,
      desc: this.state.courseDesc,
      semester: this.state.courseSemester,
      hours: this.state.courseHours,
      credits: this.state.courseCredits,
      color: this.state.color,
    }
    let {errors, isValid} = validCourseData(course);

    if (isValid) {
      this.props.addCourse(course);
      this.setState({
        open: false,
        courseGrade: 1,
        courseName: '',
        courseDesc: '',
        courseSemester: 1,
        courseHours: '',
        courseCredits: '',
        errors: {},
        color: '#000000'
      })
    } else {
      this.setState({ errors })
    }
  }

  updateCourse() {
    let course = {
      grade: this.state.courseGrade,
      teacher: this.state.courseTeacher,
      name: this.state.courseName,
      desc: this.state.courseDesc,
      semester: this.state.courseSemester,
      hours: this.state.courseHours,
      credits: this.state.courseCredits,
      color: this.state.color,
      _id: this.state.courseId,
    }
    let {errors, isValid} = validCourseData(course);

    if (isValid) {
      this.props.updateCourse(course);
      this.setState({
        open: false,
        courseGrade: '',
        courseName: '',
        courseDesc: '',
        courseSemester: '',
        courseHours: '',
        courseCredits: '',
        errors: {},
        _id: '',
      })
    } else {
      this.setState({ errors });
    }
  }

  closeDialog() {
    this.setState({
      open: false
    })
  }

  addCourse() {
    this.setState({
      dialogTitle: N18.addCourse,
      isEdit: false,
      open: true,
      courseGrade: 1,
      courseName: '',
      courseCode: '',
      courseDesc: '',
      courseSemester: 1,
      courseHours: '',
      courseCredits: '',
    })
  }

  editCourse(course) {
    this.setState({
      dialogTitle: N18.editCourse,
      isEdit: true,
      open: true,
      courseGrade: course.grade,
      courseName: course.name,
      courseDesc: course.desc,
      courseTeacher: course.teacher,
      courseSemester: course.semester,
      courseHours: course.hours,
      courseCredits: course.credits,
      courseId: course._id,
      color: course.color,
    })
  }

  setGrade(event, index, value) {
    this.setState({
      grade: value
    }, () => this.search());
  }

  setSemester(event, index, value) {
    this.setState({
      semester: value
    }, () => this.search());
  }

  search() {
    this.context.router.push(this.props.location.pathname + this.getQuery());
    this.props.loadCourses(0, this.getQuery());
  }

  searchCallback(value) {
    this.setState({
      searchInput: value
    }, () => this.search());
  }

  clearCallback() {
    this.setState({
      searchInput: ''
    }, () => this.search());
  }

  getQuery() {
    let queries = [];
    if (this.state.searchInput.trim() != '') {
      queries.push('search=' + this.state.searchInput.trim());
    }
    if (this.state.grade != 'all') {
      queries.push('grade=' + this.state.grade);
    }
    if (this.state.semester != 'all') {
      queries.push('semester=' + this.state.semester);
    }

    let query = '';
    if (queries.length > 0) {
      query = '?';
      for (let i = 0; i < queries.length; i++) {
        if (i != 0) {
          query += '&&';
        }
        query += queries[i];
      }
    }
    return query;
  }

  render() {
    let gradeFilter = (
      <SelectField
        floatingLabelText={N18.grade}
        value={this.state.grade}
        floatingLabelStyle={styles.white}
        labelStyle={styles.white}
        style={{ width: 100 }}
        onChange={this.setGrade} >
        <MenuItem value={'all'} primaryText={N18.all} />
        <MenuItem value={'1'} primaryText={N18.grade1} />
        <MenuItem value={'2'} primaryText={N18.grade2} />
        <MenuItem value={'3'} primaryText={N18.grade3} />
        <MenuItem value={'4'} primaryText={N18.grade4} />
      </SelectField>
    )

    let semesterFilter = (
      <SelectField
        floatingLabelText={N18.semester}
        value={this.state.semester}
        floatingLabelStyle={styles.white}
        labelStyle={styles.white}
        style={{ width: 150 }}
        onChange={this.setSemester}
        >
        <MenuItem value='all' primaryText={N18.all} />
        <MenuItem value='1' primaryText={N18.semester1} />
        <MenuItem value='2' primaryText={N18.semester2} />
      </SelectField>
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

    const emptyDisplay = (
      <center style={styles.top3}>
        {N18.noCourses}
      </center>
    )

    const actions = [
      <FlatButton
        label={N18.close}
        primary={true}
        onTouchTap={this.closeDialog}
        />,

      <RaisedButton
        label={N18.submit}
        labelColor='white'
        backgroundColor={this.state.color}
        onTouchTap={this.state.isEdit ? this.updateCourse : this.storeCourse}
        />,
    ]

    const dialog = (
      <Dialog
        title={this.state.dialogTitle}
        actions={actions}
        autoScrollBodyContent={true}
        modal={true}
        open={this.state.open}
        onRequestClose={this.closeDialog}
        >

        <TextField
          hintText={N18.courseName}
          onChange={this.handleChange}
          value={this.state.courseName}
          name='courseName'
          fullWidth={true}
          errorText={this.state.errors.name}
          floatingLabelText={N18.courseName} />

        <SelectField
          floatingLabelText={N18.teacher}
          value={this.state.courseTeacher}
          fullWidth={true}
          errorText={this.state.errors.teacher}
          onChange={this.handleSelectTeacher}
          >
          {this.props.teachers && this.props.teachers.map(teacher => (
            <MenuItem key={teacher._id} value={teacher._id} primaryText={teacher.name} />
          ))}
        </SelectField>

        <SelectField
          floatingLabelText={N18.grade}
          value={this.state.courseGrade}
          name='courseGrade'
          fullWidth={true}
          onChange={this.handleSelectGrade}
          >
          <MenuItem value={1} primaryText={N18.grade1} />
          <MenuItem value={2} primaryText={N18.grade2} />
          <MenuItem value={3} primaryText={N18.grade3} />
          <MenuItem value={4} primaryText={N18.grade4} />
        </SelectField>

        <SelectField
          floatingLabelText={N18.semester}
          value={this.state.courseSemester}
          name="courseSemester"
          fullWidth={true}
          onChange={this.handleSelectSemester}
          >
          <MenuItem value={1} primaryText={N18.semester1} />
          <MenuItem value={2} primaryText={N18.semester2} />
        </SelectField>

        <TextField
          hintText={N18.description}
          multiLine={true}
          onChange={this.handleChange}
          name='courseDesc'
          fullWidth={true}
          value={this.state.courseDesc}
          errorText={this.state.errors.description}
          floatingLabelText={N18.description} />

        <TextField
          hintText={N18.courseHours}
          name='courseHours'
          fullWidth={true}
          onChange={this.handleChange}
          value={this.state.courseHours}
          errorText={this.state.errors.hours}
          floatingLabelText={N18.courseHours} />


        <TextField
          hintText={N18.credits}
          name='courseCredits'
          onChange={this.handleChange}
          fullWidth={true}
          value={this.state.courseCredits}
          errorText={this.state.errors.credits}
          floatingLabelText={N18.credits} />

        <CirclePicker width="100%" onChange={this.onChangeColor} />
      </Dialog>
    )

    return (
      <Paper>
        <div style={styles.toolbar} >
          <div className="row">
            <div className="col-md-6 col-sm-12 com-xs-12">
              <SearchBar
                searchCallback={this.searchCallback}
                clearCallback={this.clearCallback}
                searchInput={this.state.searchInput}
                />
            </div>
            <div className="col-md-6 col-sm-12 com-xs-12">
              <div className="col-md-6 col-sm-6 col-xs-6">
                {gradeFilter}
              </div>
              <div className="col-md-6 col-sm-6 col-xs-6">
                {semesterFilter}
              </div>
            </div>
          </div>
          
          <div style={styles.floatBtn}>
            <FloatingActionButton secondary={true} onTouchTap={this.addCourse}>
              <ContentAdd />
            </FloatingActionButton>
          </div>
        </div>

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
                    <TableHeaderColumn style={{ width: 80 }}>{N18.operations}</TableHeaderColumn>
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
                          <MenuItem onTouchTap={() => this.editCourse(course)}>{N18.editCourse}</MenuItem>
                          <MenuItem onTouchTap={() => this.props.deleteCourse(course)}>{N18.deleteCourse}</MenuItem>
                        </IconMenu>
                      </TableRowColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            }
          </div>
        }
        {dialog}
      </Paper>
    )
  }
}

ManageCoursePage.propTypes = {
  courses: React.PropTypes.array.isRequired,
  isLoading: React.PropTypes.bool.isRequired,
  deleteCourse: React.PropTypes.func.isRequired,
  loadCourses: React.PropTypes.func.isRequired,
  teachers: React.PropTypes.array.isRequired
}

ManageCoursePage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    courses: state.courses.courses,
    isLoading: state.courses.isLoading,
    teachers: state.teachers.teachers
  }
}

export default connect(mapStateToProps, { loadCourses, deleteCourse, addCourse, updateCourse, loadAllTeachers, arrangeSchedual })(ManageCoursePage)