import React, { Component } from 'react'
import Dom from 'react-dom'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { FloatingActionButton, CircularProgress, Toolbar, SelectField, TextField, IconButton, MenuItem, IconMenu, Paper, Dialog, RaisedButton, FlatButton, Avatar, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui'
import { cyan500, cyan700, grey500, grey900 } from 'material-ui/styles/colors'
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ActionSearch from 'material-ui/svg-icons/action/search'
import ContentClear from 'material-ui/svg-icons/content/clear'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Paginator from '../../components/Paginator'
import SearchBar from '../../components/SearchBar'
import LoadingProgress from '../../components/LoadingProgress'
import AchievementDialog from '../../components/AchievementDialog'
import AutoSelectField from '../../components/AutoSelectField'
import PunishmentDialog from '../../components/PunishmentDialog'
import ActionDone from 'material-ui/svg-icons/action/done';
import FileCloudDownload from 'material-ui/svg-icons/file/cloud-download'
import FileCloudUpload from 'material-ui/svg-icons/file/cloud-upload'

import { loadTeachers, permissionUpgrade, permissionDowngrade } from '../../actions/teacherActions'
import { deleteUser } from '../../actions/userActions'
import { importFile } from '../../actions/fileActions'
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

class ManageTeacherPage extends Component {
  constructor(props) {
    super(props);

    let query = this.props.location.query;
    let sex = query.sex;
    let search = query.search;

    this.state = {
      page: 1,
      openMenuIcon: false,
      open: false,

      searchInput: search == '' || search == undefined ? '' : search,

      //filter
      sex: sex == undefined ? 'all' : sex,
    }

    this.closeMenuIcon = this.closeMenuIcon.bind(this);
    this.openMenuIcon = this.openMenuIcon.bind(this);
    this.setSex = this.setSex.bind(this);
    this.changeSearchInput = this.changeSearchInput.bind(this);
    this.getQuery = this.getQuery.bind(this);
    this.search = this.search.bind(this);
    this.searchCallback = this.searchCallback.bind(this);
    this.clearCallback = this.clearCallback.bind(this);
    this.personalDetail = this.personalDetail.bind(this);
    this._openFileDialog = this._openFileDialog.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this.upgrade = this.upgrade.bind(this);
    this.downgrade = this.downgrade.bind(this);
  }

  componentWillMount() {
    this.props.loadTeachers(0, this.props.location.search);
  }

  upgrade(teacher) {
    this.props.permissionUpgrade(teacher);
  }

  downgrade(admin) {
    this.props.permissionDowngrade(admin);
  }
  changeSearchInput(e) {
    this.setState({
      searchInput: e.target.value
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

  search() {
    this.context.router.push(this.props.location.pathname + this.getQuery());
    this.props.loadTeachers(0, this.getQuery())
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

  personalDetail(teacher) {
    this.context.router.push({
      pathname: '/users/' + teacher._id,
      state: { user: teacher }
    })
  }

  _handleChange(e) {
    this.props.importFile(Dom.findDOMNode(this.refs.fileUpload).files[0], this.context.router, 'teacher');
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
        {N18.noTeacher}
      </center>
    );

    return (
      <Paper>
        <div style={styles.toolbar}>
          <div className="row">
            <div className="col-md-6 col-sm-8 com-xs-12">
              <SearchBar
                searchCallback={this.searchCallback}
                clearCallback={this.clearCallback}
                searchInput={this.state.searchInput}
                />
            </div>
            <div className="col-md-6 col-sm-4 com-xs-12">
              {sexFilter}
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
              <Link to='/users/create?type=teacher'>
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
          </div>) : null}

        {this.props.isLoading ? <LoadingProgress /> :
          <div className="box">
            {this.props.teachers.length == 0 ? emptyDisplay :
              <Table >
                <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                  <TableRow selectable={false}>
                    <TableHeaderColumn>{N18.teacherId}</TableHeaderColumn>
                    <TableHeaderColumn >{N18.name}</TableHeaderColumn>
                    <TableHeaderColumn >{N18.sex}</TableHeaderColumn>
                    {this.props.auth.user.role == 'superAdmin' && <TableHeaderColumn >{N18.isAdmin}</TableHeaderColumn>}
                    <TableHeaderColumn style={{ width: 80 }}>操作</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} showRowHover={true}>
                  {this.props.teachers.map(teacher => (
                    <TableRow key={teacher._id}>
                      <TableRowColumn>{teacher.userId}</TableRowColumn>
                      <TableRowColumn>{teacher.name}</TableRowColumn>
                      <TableRowColumn>{teacher.sex == 'M' ? N18.male : N18.female}</TableRowColumn>
                      {this.props.auth.user.role == 'superAdmin' && <TableHeaderColumn >{teacher.role.slug == 'admin' && <ActionDone color='green' />}</TableHeaderColumn>}
                      <TableRowColumn style={{ width: 80 }}>
                        <IconMenu useLayerForClickAway={true} iconButtonElement={iconButtonElement}>
                          <Link to={'/users/' + teacher._id + '/edit'}><MenuItem>{N18.editTeacher}</MenuItem></Link>
                          <MenuItem onTouchTap={() => this.personalDetail(teacher)}>{N18.details}</MenuItem>
                          {this.props.auth.user.role == 'superAdmin' ?
                            <div>
                              {teacher.role && teacher.role.slug == 'teacher' && <MenuItem onTouchTap={() => this.upgrade(teacher)}>{N18.upgrade}</MenuItem>}
                              {teacher.role && teacher.role.slug == 'admin' && <MenuItem onTouchTap={() => this.downgrade(teacher)}>{N18.downgrade}</MenuItem>}
                            </div>
                            : null
                          }
                          <MenuItem onTouchTap={() => this.props.deleteUser(teacher, 'teacher')}>{N18.deleteTeacher}</MenuItem>
                        </IconMenu>
                      </TableRowColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            }

            <Paginator
              paginate={this.props.paginate}
              query={this.props.location.search}
              loadData={this.props.loadTeachers}
              />
          </div>
        }
      </Paper>
    )
  }
}

ManageTeacherPage.propTypes = {
  teachers: React.PropTypes.array.isRequired,
  paginate: React.PropTypes.object.isRequired,
  auth: React.PropTypes.object.isRequired,
  isLoading: React.PropTypes.bool.isRequired,
  loadTeachers: React.PropTypes.func.isRequired,
  deleteUser: React.PropTypes.func.isRequired,
  importFile: React.PropTypes.func.isRequired
}

ManageTeacherPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    teachers: state.teachers.teachers,
    paginate: state.teachers.paginate,
    auth: state.auth,
    isLoading: state.teachers.isLoading
  }
}

export default connect(mapStateToProps, { loadTeachers, importFile, deleteUser, permissionUpgrade, permissionDowngrade })(ManageTeacherPage)