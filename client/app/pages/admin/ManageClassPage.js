import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { FlatButton, RaisedButton, FloatingActionButton, TextField, Paper, Dialog, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, SelectField, MenuItem, IconMenu, IconButton } from 'material-ui'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ContentAdd from 'material-ui/svg-icons/content/add';
import { cyan500, cyan700, grey500, grey900 } from 'material-ui/styles/colors'

import Paginator from '../../components/Paginator'

import SearchBar from '../../components/SearchBar'
import LoadingProgress from '../../components/LoadingProgress'

import { updateClass, loadClasses, deleteClass, addClass } from '../../actions/classActions'

import N18 from '../../constants/string'
import { validClassData } from '../../utils/validators'

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
  }
}

class ManageClassPage extends Component {
  constructor(props) {
    super(props);

    let grade = this.props.location.query.grade;
    let search = this.props.location.query.search;

    this.state = {
      //filter
      grade: grade == undefined ? 'all' : grade,
      searchInput: search == undefined ? '' : search,

      //dialog
      isEdit: false,
      open: false,
      errors: {},
      cls: {},
      dialogTitle: ''
    }

    this.setGrade = this.setGrade.bind(this);
    this.search = this.search.bind(this);
    this.searchCallback = this.searchCallback.bind(this);
    this.clearCallback = this.clearCallback.bind(this);
    this.getQuery = this.getQuery.bind(this);
    this.addClass = this.addClass.bind(this);
    this.editClass = this.editClass.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.storeClass = this.storeClass.bind(this);
    this.onChangeGrade = this.onChangeGrade.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.updateClass = this.updateClass.bind(this);
  }
  
  componentWillMount() {
    this.props.loadClasses(this.props.location.search);
  }

  //改变新班级的年级
  onChangeGrade(event, index, value) {
    let cls = this.state.cls;
    cls.grade = value;
    this.setState({ cls });
  }

  //改变新班级的名称
  onChangeName(e) {
    let cls = this.state.cls;
    cls.name = e.target.value;
    this.setState({ cls });
  }

  //保存新班级
  storeClass() {
    let cls = this.state.cls;

    let {errors, isValid} = validClassData(cls);
    if (isValid) {
      this.props.addClass(cls);
      this.setState({
        open: false,
        errors: {},
        cls: {}
      })
    } else {
      this.setState({ errors })
    }
  }

  //更新班级
  updateClass() {
    let cls = this.state.cls;
    let {errors, isValid} = validClassData(cls);
    if (isValid) {
      this.props.updateClass(cls);
      this.setState({
        open: false,
        cls: {},
        errors: {}
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

  //调用添加新班级的Dialog
  addClass() {
    this.setState({
      dialogTitle: N18.addClass,
      isEdit: false,
      open: true,
      cls: {
        grade: '1',
        name: ''
      }
    })
  }

  //调用修改班级的Dialog
  editClass(cls) {
    this.setState({
      dialogTitle: N18.editClass,
      isEdit: true,
      open: true,
      cls: {
        grade: cls.grade,
        name: cls.name,
        _id: cls._id
      }
    })
  }


  //改变年级
  setGrade(event, index, value) {
    this.setState({
      grade: value
    }, () => this.search());
  }

  //调用过滤器和搜索
  search() {
    this.context.router.push(this.props.location.pathname + this.getQuery());
    this.props.loadClasses(this.getQuery());
  }

  //搜索
  searchCallback(value) {
    this.setState({
      searchInput: value
    }, () => this.search());
  }

  //清除搜索框文本
  clearCallback() {
    this.setState({
      searchInput: ''
    }, () => this.search());
  }

  //取得过滤条件
  getQuery() {
    let queries = [];
    if (this.state.searchInput.trim() != '') {
      queries.push('search=' + this.state.searchInput.trim());
    }
    if (this.state.grade != 'all') {
      queries.push('grade=' + this.state.grade);
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

    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip={N18.more}
        tooltipPosition="bottom-left"
        >
        <MoreVertIcon color={grey500} />
      </IconButton>
    )

    //无内容时展示
    const emptyDisplay = (
      <center style={styles.top3}>
        {N18.noClasses}
      </center>
    )

    //dialog的按钮
    const actions = [
      <FlatButton
        label={N18.close}
        primary={true}
        onTouchTap={this.closeDialog}
        />,

      <RaisedButton
        label={N18.submit}
        primary={true}
        onTouchTap={this.state.isEdit ? this.updateClass : this.storeClass}
        />,
    ]
    
    //新增，修改的Dialog
    const dialog = (
      <Dialog
        title={this.state.dialogTitle}
        actions={actions}
        modal={true}
        open={this.state.open}
        onRequestClose={this.closeDialog}
        >

        <TextField
          hintText={N18.className}
          onChange={this.onChangeName}
          value={this.state.cls.name}
          fullWidth={true}
          errorText={this.state.errors.name}
          floatingLabelText={N18.className} />

        <SelectField
          floatingLabelText={N18.grade}
          value={this.state.cls.grade}
          fullWidth={true}
          onChange={this.onChangeGrade}
          >
          <MenuItem value={'1'} primaryText={N18.grade1} />
          <MenuItem value={'2'} primaryText={N18.grade2} />
          <MenuItem value={'3'} primaryText={N18.grade3} />
          <MenuItem value={'4'} primaryText={N18.grade4} />
        </SelectField>
      </Dialog>
    )

    return (
      <Paper>
        <div style={styles.toolbar} >
          <div className="row">
            <div className="col-md-6 col-sm-9 com-xs-12">
              <SearchBar
                searchCallback={this.searchCallback}
                clearCallback={this.clearCallback}
                searchInput={this.state.searchInput}
                />
            </div>
            <div className="col-md-6 col-sm-3 com-xs-12">
              {gradeFilter}
            </div>
          </div>

          <div style={styles.floatBtn}>
            <FloatingActionButton secondary={true} onTouchTap={this.addClass}>
              <ContentAdd />
            </FloatingActionButton>
          </div>
        </div>
        {this.props.isLoading ? <LoadingProgress /> :
          <div className="box">
            {this.props.classes.length == 0 ? emptyDisplay :
              <Table >
                <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                  <TableRow selectable={false}>
                    <TableHeaderColumn >{N18.grade}</TableHeaderColumn>
                    <TableHeaderColumn >{N18.className}</TableHeaderColumn>
                    <TableHeaderColumn style={{ width: 80 }}>操作</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} showRowHover={true}>
                  {this.props.classes && this.props.classes.map(cls => (
                    <TableRow key={cls._id}>
                      <TableRowColumn>{cls.grade}</TableRowColumn>
                      <TableRowColumn>{N18.getClasss(cls.grade, cls.name)}</TableRowColumn>
                      <TableRowColumn style={{ width: 80 }}>
                        <IconMenu useLayerForClickAway={true} iconButtonElement={iconButtonElement}>
                          <Link to={'/manageScheduals/' + cls._id}><MenuItem >{N18.viewSchedual}</MenuItem></Link>
                          <MenuItem onTouchTap={() => this.editClass(cls)}>{N18.editClass}</MenuItem>
                          <MenuItem onTouchTap={() => this.props.deleteClass(cls)}>{N18.deleteClass}</MenuItem>
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

ManageClassPage.propTypes = {
  classes: React.PropTypes.array.isRequired,
  isLoading: React.PropTypes.bool.isRequired,
  deleteClass: React.PropTypes.func.isRequired,
  loadClasses: React.PropTypes.func.isRequired
}

ManageClassPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    classes: state.classes.classes,
    isLoading: state.classes.isLoading
  }
}

export default connect(mapStateToProps, { loadClasses, deleteClass, addClass, updateClass })(ManageClassPage)