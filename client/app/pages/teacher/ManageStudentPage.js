import React, { Component } from 'react'
import Dom from 'react-dom'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { Snackbar, FloatingActionButton, CircularProgress, Toolbar, SelectField, TextField, IconButton, MenuItem, IconMenu, Paper, Dialog, RaisedButton, FlatButton, Avatar, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui'
import { cyan500, cyan700, grey500, grey900 } from 'material-ui/styles/colors'
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Paginator from '../../components/Paginator'
import SearchBar from '../../components/SearchBar'
import LoadingProgress from '../../components/LoadingProgress'
import AchievementDialog from '../../components/AchievementDialog'
import AutoSelectField from '../../components/AutoSelectField'
import PunishmentDialog from '../../components/PunishmentDialog'
import FileCloudDownload from 'material-ui/svg-icons/file/cloud-download'
import FileCloudUpload from 'material-ui/svg-icons/file/cloud-upload'

import { loadStudents } from '../../actions/studentActions'
import { addAchievement } from '../../actions/achievementActions'
import { deleteUser } from '../../actions/userActions'
import { addPunishment } from '../../actions/punishmentActions'
import { loadNotSubmitCollects, addStudentToCollect } from '../../actions/collectActions'
import { importFile, exportFile } from '../../actions/fileActions'
import N18 from '../../constants/string'

const styles = {
  white: {
    color: 'white'
  },

  black: {
    color: grey900
  },

  top3: {
    marginTop: 30
  },
  toolbar: {
    padding: "10px 30px 20px 30px",
    background: cyan500,
  },

  toolbar2: {
    paddingTop: 10,
    background: cyan700
  },

  select: {
    color: '#A4A4A4',
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 12
  },

  floatBtn: {
    float: 'right',
    marginTop: 17
  }
}

class ManageStudentPage extends Component {
  constructor(props) {
    super(props);

    let query = this.props.location.query;
    let sex = query.sex;
    let grade = query.grade;
    let classs = query.class;
    let classname = query.classname;
    let search = query.search;

    this.state = {
      page: 1,
      openMenuIcon: false,
      open: false,

      searchInput: search == '' || search == undefined ? '' : search,

      //filter
      sex: sex == undefined ? 'all' : sex,
      grade: grade == undefined ? 'all' : grade,
      classs: classs == undefined ? 'all' : classs, //class
      classname: classname == undefined ? 'all' : classname,

      //achievement dialog
      currentStudent: {},
      openAchievementDialog: false,

      openPunishmentDialog: false,
      openListDialog: false,
      selectCollect: '',
      selectCollectTitle: '',

      openSnackbar: false,
      message: ''
    }

    this.openAchievementDialog = this.openAchievementDialog.bind(this);
    this.closeAchievementDialog = this.closeAchievementDialog.bind(this)

    this.openPunishmentDialog = this.openPunishmentDialog.bind(this);
    this.closePunishmentDialog = this.closePunishmentDialog.bind(this);

    this.openListDialog = this.openListDialog.bind(this);
    this.closeListDialog = this.closeListDialog.bind(this);
    this.closeMenuIcon = this.closeMenuIcon.bind(this);
    this.openMenuIcon = this.openMenuIcon.bind(this);
    this.setgrade = this.setgrade.bind(this);
    this.setSex = this.setSex.bind(this);
    this.setClass = this.setClass.bind(this);
    this.changeSearchInput = this.changeSearchInput.bind(this);
    this.getQuery = this.getQuery.bind(this);
    this.search = this.search.bind(this);
    this.searchCallback = this.searchCallback.bind(this);
    this.clearCallback = this.clearCallback.bind(this);
    this.personalDetail = this.personalDetail.bind(this);
    this.addStudentToList = this.addStudentToList.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this._openFileDialog = this._openFileDialog.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this.exportFile = this.exportFile.bind(this);
    this.closeSnackbar = this.closeSnackbar.bind(this);
  }

  componentWillMount() {
    this.props.loadStudents(0, this.props.location.search);
    this.props.loadNotSubmitCollects(this.props.auth.user._id);
  }

  closeSnackbar() {
    this.setState({ openSnackbar: false })
  }
  exportFile() {
    this.props.exportFile();

    this.setState({
      openSnackbar: true,
      message: N18.onArchive
    })
  }

  changeSearchInput(e) {
    this.setState({
      searchInput: e.target.value
    })
  }

  openAchievementDialog(student) {
    this.setState({
      currentStudent: student,
      openAchievementDialog: true
    })
  }

  closeAchievementDialog() {
    this.setState({
      openAchievementDialog: false
    })
  }

  openPunishmentDialog(student) {
    this.setState({
      currentStudent: student,
      openPunishmentDialog: true
    })
  }

  closePunishmentDialog() {
    this.setState({
      openPunishmentDialog: false
    })
  }

  openListDialog(student) {
    this.setState({
      open: true,
      student: student
    })
  }

  closeListDialog() {
    this.setState({
      open: false
    })
  }

  handleSelection(e, value) {
    let title = '';
    this.props.collects.map(collect => {
      if (value == collect._id) {
        title = collect.title
      }
    })
    this.setState({
      selectCollect: value,
      selectCollectTitle: title
    })
  }

  addStudentToList() {
    this.props.addStudentToCollect(this.state.selectCollect, this.state.student._id);
    this.setState({
      student: {},
      selectCollect: '',
      selectCollectTitle: '',
      open: false
    })
  }

  closeMenuIcon() {
    this.setState({ openMenuIcon: false });
  }

  openMenuIcon() {
    this.setState({ openMenuIcon: true });
  }

  setSex(event, index, value) {
    this.setState({
      sex: value
    }, () => this.search());
  }

  setgrade(event, index, value) {
    this.setState({
      grade: value
    }, () => this.search());
  }

  setClass(event, index, value) {
    this.setState({
      classs: value
    }, () => this.search());
  }

  search() {
    this.context.router.push(this.props.location.pathname + this.getQuery());
    this.props.loadStudents(0, this.getQuery())
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
    if (this.state.sex != 'all') {
      queries.push('sex=' + this.state.sex);
    }
    if (this.state.grade != 'all') {
      queries.push('grade=' + this.state.grade);
    }
    if (this.state.classs != 'all') {
      queries.push('class=' + this.state.classs);
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

  personalDetail(student) {
    this.context.router.push({
      pathname: '/users/' + student._id,
      state: { user: student }
    })
  }

  _handleChange(e) {
    this.props.importFile(Dom.findDOMNode(this.refs.fileUpload).files[0], this.context.router);
  }

  _openFileDialog() {
    var fileUploadDom = Dom.findDOMNode(this.refs.fileUpload);
    fileUploadDom.click();
  }

  render() {
    let sexFilter = (
      <SelectField
        floatingLabelText={N18.sex}
        value={this.state.sex}

        floatingLabelStyle={styles.white}
        labelStyle={styles.white}
        name='sex'
        style={{ width: 80 }}
        onChange={this.setSex} >
        <MenuItem value={'all'} primaryText={N18.all} />
        <MenuItem value={'M'} primaryText={N18.male} />
        <MenuItem value={'F'} primaryText={N18.female} />
      </SelectField>
    );

    let gradeFilter = (
      <SelectField
        floatingLabelText={N18.grade}
        value={this.state.grade}
        floatingLabelStyle={styles.white}
        labelStyle={styles.white}
        style={{ width: 100 }}
        onChange={this.setgrade} >
        <MenuItem value={'all'} primaryText={N18.all} />
        <MenuItem value={'1'} primaryText={N18.grade1} />
        <MenuItem value={'2'} primaryText={N18.grade2} />
        <MenuItem value={'3'} primaryText={N18.grade3} />
        <MenuItem value={'4'} primaryText={N18.grade4} />
      </SelectField>
    );

    //class filter
    let clsFilter = (
      <SelectField
        floatingLabelText={N18.classs}
        style={{ width: 100 }}
        value={this.state.classs}
        floatingLabelStyle={styles.white}
        labelStyle={styles.white}
        onChange={this.setClass}
        >
        <MenuItem value={'all'} primaryText={N18.all} />
        {this.props.auth.user.classes.map(classs => (
          <MenuItem key={classs._id} value={classs._id} primaryText={N18.getClasss(classs.grade, classs.name)} />
        ))}
      </SelectField>
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

    const emptyDisplay = (
      <center style={styles.top3}>
        {N18.noStudent}
      </center>
    );

    const actions = [
      <FlatButton
        label={N18.close}
        primary={true}
        onTouchTap={this.closeListDialog}
        />,
      <RaisedButton
        label={N18.save}
        primary={true}
        onTouchTap={this.addStudentToList}
        />,
    ]

    let collects = [];
    this.props.collects && this.props.collects.map(collect => {
      collects.push(
        <div key={collect._id} value={collect._id} label={collect.title} style={{ whiteSpace: 'normal' }}>
          {collect.title}
        </div>
      )
    });


    const dialog = (
      <Dialog
        title={N18.addStudentToList}
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.closeListDialog}
        >
        <TextField
          hintText={N18.name}
          value={this.state.student && this.state.student.name}
          disabled={true}
          fullWidth={true}
          name="name"
          floatingLabelText={N18.name} />

        <div style={styles.select}>{N18.selectCollect}</div>
        <AutoSelectField
          name="selectCollect"
          hintText={N18.selectCollect}
          floatingLabelText={N18.selectCollect}
          value={this.state.selectCollectTitle}
          onSelect={this.handleSelection}
          >
          {collects}
        </AutoSelectField>
      </Dialog>
    )

    let isAdmin = this.props.auth.user.role == 'admin' || this.props.auth.user.role == 'superAdmin';

    return (
      <Paper>
        <div style={styles.toolbar}>
          <div className="row">
            <div className="col-md-6 col-sm-6 com-xs-12">
              <SearchBar
                searchCallback={this.searchCallback}
                clearCallback={this.clearCallback}
                searchInput={this.state.searchInput}
                />
            </div>
            <div className="col-md-6 col-sm-12 com-xs-12">
              <div className="col-md-4 col-sm-4 col-xs-4">
                {sexFilter}
              </div>
              <div className="col-md-4 col-sm-4 col-xs-4">
                {gradeFilter}
              </div>
              <div className="col-md-4 col-sm-4 col-xs-4">
                {clsFilter}
              </div>
            </div>
          </div>
        </div>
        {this.props.auth.user.role == 'superAdmin' ? (
          <div className="toolbar" style={styles.toolbar2}>
            <FlatButton
              icon={<FileCloudUpload />}
              label={N18.import}
              style={{ color: 'white' }}
              onClick={this._openFileDialog} />

            <div style={styles.floatBtn}>
              <Link to='/users/create?type=student'>
                <FloatingActionButton secondary={true}>
                  <ContentAdd />
                </FloatingActionButton>
              </Link>
            </div>

            <input
              ref="fileUpload"
              type="file"
              style={{ "display": "none" }}
              onChange={this._handleChange} />
          </div>)
          : null}
        {this.props.isLoading ? <LoadingProgress /> :
          <div className="box">
            {this.props.students.length == 0 ? emptyDisplay :
              <Table >
                <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                  <TableRow selectable={false}>
                    <TableHeaderColumn>{N18.studentId}</TableHeaderColumn>
                    <TableHeaderColumn >{N18.name}</TableHeaderColumn>
                    <TableHeaderColumn className="hidden-xs">{N18.sex}</TableHeaderColumn>
                    <TableHeaderColumn className="hidden-xs" >{N18.grade}</TableHeaderColumn>
                    <TableHeaderColumn className="hidden-xs" >{N18.class}</TableHeaderColumn>
                    <TableHeaderColumn style={{ width: 80 }}>操作</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} showRowHover={true}>
                  {this.props.students.map(student => (
                    <TableRow key={student._id}>
                      <TableRowColumn>{student.userId}</TableRowColumn>
                      <TableRowColumn>{student.name}</TableRowColumn>
                      <TableRowColumn className="hidden-xs" >{student.sex == 'M' ? N18.male : N18.female}</TableRowColumn>
                      <TableRowColumn className="hidden-xs" >{student.grade}</TableRowColumn>
                      <TableRowColumn className="hidden-xs" >{student.class && student.class.name}</TableRowColumn>
                      <TableRowColumn style={{ width: 80 }}>
                        <IconMenu useLayerForClickAway={true} iconButtonElement={iconButtonElement}>
                          {isAdmin && (<Link to={'/users/' + student._id + '/edit'}><MenuItem>{N18.editStudent}</MenuItem></Link>)}
                          <MenuItem onTouchTap={() => this.personalDetail(student)}>{N18.details}</MenuItem>
                          <MenuItem onTouchTap={() => this.openAchievementDialog(student)}>{N18.addAchievement}</MenuItem>
                          <Link to={"/manageAchievement?student=" + student._id}><MenuItem>{N18.readAchievements}</MenuItem></Link>
                          <MenuItem onTouchTap={() => this.openPunishmentDialog(student)}>{N18.addPunishment}</MenuItem>
                          <Link to={"/managePunishment?student=" + student._id} ><MenuItem>{N18.readPunishments}</MenuItem></Link>
                          <MenuItem onTouchTap={() => this.openListDialog(student)}>{N18.addToList}</MenuItem>
                          {isAdmin && (<MenuItem onTouchTap={() => this.props.deleteUser(student, 'student')}>{N18.deleteStudent}</MenuItem>)}
                          <Link to={"/scores/" + student._id} ><MenuItem>{N18.scores}</MenuItem></Link>
                        </IconMenu>
                      </TableRowColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            }

            <AchievementDialog
              student={this.state.currentStudent}
              open={this.state.openAchievementDialog}
              action='new'
              closeCallback={this.closeAchievementDialog}
              addAchievement={this.props.addAchievement}
              />

            <PunishmentDialog
              student={this.state.currentStudent}
              action='new'
              open={this.state.openPunishmentDialog}
              closeCallback={this.closePunishmentDialog}
              addPunishment={this.props.addPunishment}
              />

            <Paginator
              paginate={this.props.paginate}
              query={this.props.location.search}
              loadData={this.props.loadStudents}
              />
          </div>
        }
        {dialog}
        <Snackbar
          open={this.state.openSnackbar}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.closeSnackbar}
          />
      </Paper>
    )
  }
}

ManageStudentPage.propTypes = {
  addAchievement: React.PropTypes.func.isRequired,
  addPunishment: React.PropTypes.func.isRequired,
  loadNotSubmitCollects: React.PropTypes.func.isRequired,
  collects: React.PropTypes.array.isRequired
}

ManageStudentPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    students: state.students.students,
    paginate: state.students.paginate,
    auth: state.auth,
    collects: state.collects.collects,
    isLoading: state.students.isLoading
  }
}

export default connect(mapStateToProps, { loadStudents, addAchievement, addPunishment, loadNotSubmitCollects, addStudentToCollect, importFile, exportFile, deleteUser })(ManageStudentPage)