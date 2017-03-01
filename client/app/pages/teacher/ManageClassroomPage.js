import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, FloatingActionButton, RaisedButton, Toolbar, MenuItem, IconButton, IconMenu, Paper, Dialog, FlatButton, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui'
import { loadClassrooms, updateClassroom, deleteClassroom, addClassroom } from '../../actions/classroomActions'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ActionDone from 'material-ui/svg-icons/action/done';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { cyan500, grey500, grey900 } from 'material-ui/styles/colors'

import Paginator from '../../components/Paginator'
import LoadingProgress from '../../components/LoadingProgress'
import N18 from '../../constants/string'

import { validateClassroomData } from '../../utils/validators'

class ManageClassroomPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      action: '',
      open: false,
      classroom: {},
      name: '',
    }

    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.onChange = this.onChange.bind(this);
    this.storeClassroom = this.storeClassroom.bind(this);
  }

  componentWillMount() {
    let page = 0;
    this.props.loadClassrooms(page);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  openDialog() {
    this.setState({ open: true })
  }

  closeDialog() {
    this.setState({ open: false })
  }

  storeClassroom() {
    console.log('store classroomr');
    let classroom = {
      name: this.state.name.trim(),
    }

    let {errors, isValid} = validateClassroomData(collect);

    if (isValid) {
      this.props.addClassroom(collect);
      this.setState({
        errors: {},
        name: '',
        open: false
      })
    } else {
      this.setState({ errors })
    }
  }

  render() {
    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip={N18.more}
        tooltipPosition="bottom-left"
        >
        <MoreVertIcon color={grey500} />
      </IconButton>
    )

    const actions = [
      <FlatButton
        label={N18.cancel}
        onTouchTap={this.closeDialog}
        />,
      <RaisedButton
        label={N18.submit}
        primary={true}
        onTouchTap={this.storeClassroom}
        />
    ]

    const dialog = (
      <Dialog
        title={N18.new + N18.classroom}
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.closeDialog}
        >

        <TextField
          hintText={N18.classroom}
          fullWidth={true}
          name='name'
          onChange={this.onChange}
          value={this.state.name}
          errorText={this.state.errors.name}
          floatingLabelText={N18.classroom} />
      </Dialog>
    )

    let isAdmin = this.props.auth.user.role == 'admin' || this.props.auth.user.role == 'superAdmin'

    return (
      <Paper>
        <div style={styles.toolbar} className="toolbar">
          <SearchBar
            clearCallback={this.clearCallback}
            searchCallback={this.searchCallback}
            searchInput={this.state.searchInput}
            />
          {isAdmin &&
            <span style={styles.buttons}>
              <FloatingActionButton secondary={true} onTouchTap={this.createClassroom} >
                <ContentAdd />
              </FloatingActionButton>
            </span>
          }
        </div>
        <div className="box">
          {this.props.isLoading ? <LoadingProgress /> :
            (
              <div>
                <Table >
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                    <TableRow selectable={false}>
                      <TableHeaderColumn>{N18.classroomTitle}</TableHeaderColumn>
                      <TableHeaderColumn className="hidden-xs" style={{ width: 120 }}>{N18.name}</TableHeaderColumn>
                      <TableHeaderColumn className="hidden-xs" style={{ width: 120 }}>{N18.isSubmit}</TableHeaderColumn>
                      <TableHeaderColumn style={{ width: 80 }}>操作</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false} showRowHover={true}>
                    {this.props.classrooms.map(classroom => (
                      <TableRow key={classroom._id}>
                        <TableRowColumn>{classroom.name}</TableRowColumn>
                        <TableRowColumn className="hidden-xs" style={{ width: 120 }}>{classroom.occupe ? N18.usedBy + classroom.usedBy.name : N18.inoccupe}</TableRowColumn>
                        <TableRowColumn style={{ width: 80 }}>
                          <IconMenu
                            useLayerForClickAway={true}
                            iconButtonElement={iconButtonElement}>
                            {isAdmin && <MenuItem onTouchTap={() => this.props.deleteClassroom(classroom)}>{N18.delete}</MenuItem>}
                          </IconMenu>
                        </TableRowColumn>
                      </TableRow>
                    ))
                    }
                  </TableBody>
                </Table>
                <Paginator
                  paginate={this.props.paginate}
                  query={this.props.location.search}
                  loadData={this.props.loadClassrooms}
                  />
              </div>
            )
          }
        </div>
        {dialog}
      </Paper>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.auth,
    classroomrs: state.classrooms.classrooms,
    paginate: state.classrooms.paginate,
    isLoading: state.classrooms.isLoading
  }
}

ManageClassroomPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, { loadClassrooms, updateClassroom, deleteClassroom, addClassroom })(ManageClassroomPage)