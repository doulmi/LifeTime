import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, FloatingActionButton, RaisedButton, Toolbar, MenuItem, IconButton, IconMenu, Paper, Dialog, FlatButton, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui'
import { loadClassrooms, updateClassroom, deleteClassroom, addClassroom } from '../../actions/classroomActions'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ActionDone from 'material-ui/svg-icons/action/done';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { cyan500, grey500, grey900, cyan700 } from 'material-ui/styles/colors'

import Paginator from '../../components/Paginator'
import LoadingProgress from '../../components/LoadingProgress'
import N18 from '../../constants/string'

import { validateClassroomData } from '../../utils/validators'


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
    minHeight: 85,
    padding: "10px 30px 20px 30px",
    background: cyan500,
  },

  toolbar2: {
    minHeight: 35,
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
    marginTop: 0
  }
}


class ManageClassroomPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      action: '',
      open: false,
      classroom: {},
      modify: false,
      id: '',
      name: '',
    }

    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.onChange = this.onChange.bind(this);
    this.storeClassroom = this.storeClassroom.bind(this);
    this.createClassroom = this.createClassroom.bind(this);
    this.updateClassroom = this.updateClassroom.bind(this);
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

  createClassroom() {
    this.setState({
      open: true,
      modify: false,
      name: ''
    })
  }

  //查看设备
  readClassroom(classroom) {
    this.setState({
      open: true,
      id: classroom._id,
      modify: true,
      name: classroom.name
    })
  }

  closeDialog() {
    this.setState({ open: false })
  }

  //更新设备
  updateClassroom() {
    const classroom = {
      _id: this.state.id,
      name: this.state.name.trim(),
    }

    let {errors, isValid} = validateClassroomData(classroom);

    if (isValid) {
      this.props.updateClassroom(classroom);
      this.setState({
        errors: {},
        name: '',
        open: false
      })
    } else {
      this.setState({ errors })
    }
  }

  //存储设备
  storeClassroom() {
    let classroom = {
      name: this.state.name.trim(),
    }

    let {errors, isValid} = validateClassroomData(classroom);

    if (isValid) {
      this.props.addClassroom(classroom);
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
        onTouchTap={this.state.modify ? this.updateClassroom : this.storeClassroom}
        />
    ]

    const dialog = (
      <Dialog
        title={(this.state.modify ? N18.modify : N18.new) + N18.classroom}
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.closeDialog}
        >

        <TextField
          hintText={N18.classroomName}
          fullWidth={true}
          name='name'
          onChange={this.onChange}
          value={this.state.name}
          errorText={this.state.errors.name}
          floatingLabelText={N18.classroomName} />
      </Dialog>
    )

    let isAdmin = this.props.auth.user.role == 'admin' || this.props.auth.user.role == 'superAdmin'

    return (
      <Paper>
        <div style={styles.toolbar}>
          <div className="row">
            <div className="col-md-6 col-sm-8 com-xs-12">
            </div>
            <div className="col-md-6 col-sm-4 com-xs-12">
            </div>
          </div>
        </div>

        {isAdmin ? (
          <div className="toolbar" style={styles.toolbar2}>
            <div style={styles.floatBtn}>
              <FloatingActionButton secondary={true} onTouchTap={this.createClassroom}>
                <ContentAdd />
              </FloatingActionButton>
            </div>
          </div>)
          : null}

        <div className="box">
          {this.props.isLoading ? <LoadingProgress /> :
            (
              <div>
                <Table >
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                    <TableRow selectable={false}>
                      <TableHeaderColumn>{N18.classroomName}</TableHeaderColumn>
                      <TableHeaderColumn style={{ width: 80 }}>{N18.operations}</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false} showRowHover={true}>
                    {this.props.classrooms.map(classroom => (
                      <TableRow key={classroom._id}>
                        <TableRowColumn>{classroom.name}</TableRowColumn>
                        <TableRowColumn style={{ width: 80 }}>
                          <IconMenu useLayerForClickAway={true} iconButtonElement={iconButtonElement}>
                            {isAdmin && <MenuItem onTouchTap={() => this.readClassroom(classroom)}>{N18.modify}</MenuItem>}
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

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    classrooms: state.classrooms.classrooms,
    paginate: state.classrooms.paginate,
    isLoading: state.classrooms.isLoading
  };
};

ManageClassroomPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps, { loadClassrooms, updateClassroom, deleteClassroom, addClassroom })(ManageClassroomPage);