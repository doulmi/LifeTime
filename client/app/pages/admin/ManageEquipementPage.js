import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, FloatingActionButton, RaisedButton, Toolbar, MenuItem, IconButton, IconMenu, Paper, Dialog, FlatButton, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui'
import { loadEquipements, updateEquipement, deleteEquipement, addEquipement } from '../../actions/equipementActions'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ActionDone from 'material-ui/svg-icons/action/done';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { cyan500, grey500, grey900, cyan700 } from 'material-ui/styles/colors'

import Paginator from '../../components/Paginator'
import LoadingProgress from '../../components/LoadingProgress'
import N18 from '../../constants/string'

import { validateEquipementData } from '../../utils/validators'


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


class ManageEquipementPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      action: '',
      open: false,
      equipement: {},
      modify: false,
      id: '',
      name: '',
      description: '',
    }

    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.onChange = this.onChange.bind(this);
    this.storeEquipement = this.storeEquipement.bind(this);
    this.createEquipement = this.createEquipement.bind(this);
    this.updateEquipement = this.updateEquipement.bind(this);
    this.historyRecords = this.historyRecords.bind(this)
  }

  componentWillMount() {
    let page = 0;
    this.props.loadEquipements(page);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  openDialog() {
    this.setState({ open: true })
  }

  createEquipement() {
    this.setState({
      open: true,
      description: '',
      modify: false,
      name: ''
    })
  }

  //查看设备
  readEquipement(equipement) {
    this.setState({
      open: true,
      description: equipement.description,
      id: equipement._id,
      modify: true,
      name: equipement.name
    })
  }

  closeDialog() {
    this.setState({ open: false })
  }

  //更新设备
  updateEquipement() {
    const equipement = {
      _id: this.state.id,
      name: this.state.name.trim(),
      description: this.state.description.trim(),
    }

    let {errors, isValid} = validateEquipementData(equipement);

    if (isValid) {
      this.props.updateEquipement(equipement);
      this.setState({
        errors: {},
        name: '',
        description: '',
        open: false
      })
    } else {
      this.setState({ errors })
    }
  }

  historyRecords(equipement) {
    this.context.router.push({
      pathname: '/equipements/' + equipement._id,
      state: { equipement: equipement }
    }) 
  }

  //存储设备
  storeEquipement() {
    let equipement = {
      name: this.state.name.trim(),
      description: this.state.description.trim(),
    }

    let {errors, isValid} = validateEquipementData(equipement);

    if (isValid) {
      this.props.addEquipement(equipement);
      this.setState({
        errors: {},
        name: '',
        description: '',
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
        onTouchTap={this.state.modify ? this.updateEquipement : this.storeEquipement}
        />
    ]

    const dialog = (
      <Dialog
        title={(this.state.modify ? N18.modify : N18.new) + N18.equipement}
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.closeDialog}
        >

        <TextField
          hintText={N18.equipementName}
          fullWidth={true}
          name='name'
          onChange={this.onChange}
          value={this.state.name}
          errorText={this.state.errors.name}
          floatingLabelText={N18.equipementName} />

        <TextField
          hintText={N18.equipementDesc}
          multiLine={true}
          rows={3}
          fullWidth={true}
          name='description'
          onChange={this.onChange}
          value={this.state.description}
          errorText={this.state.errors.description}
          floatingLabelText={N18.equipementDesc} />
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
              <FloatingActionButton secondary={true} onTouchTap={this.createEquipement}>
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
                      <TableHeaderColumn>{N18.equipementName}</TableHeaderColumn>
                      <TableHeaderColumn>{N18.description}</TableHeaderColumn>
                      <TableHeaderColumn style={{ width: 80 }}>{N18.operations}</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false} showRowHover={true}>
                    {this.props.equipements.map(equipement => (
                      <TableRow key={equipement._id}>
                        <TableRowColumn>{equipement.name}</TableRowColumn>
                        <TableRowColumn>{equipement.description}</TableRowColumn>
                        <TableRowColumn style={{ width: 80 }}>
                          <IconMenu useLayerForClickAway={true} iconButtonElement={iconButtonElement}>
                            <MenuItem onTouchTap={() => this.historyRecords(equipement)}>{N18.recordHistory}</MenuItem>
                            <MenuItem onTouchTap={() => this.readEquipement(equipement)}>{N18.modify}</MenuItem>
                            <MenuItem onTouchTap={() => this.props.deleteEquipement(equipement)}>{N18.delete}</MenuItem>
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
                  loadData={this.props.loadEquipements}
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
    equipements: state.equipements.equipements,
    paginate: state.equipements.paginate,
    isLoading: state.equipements.isLoading
  };
};

ManageEquipementPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps, { loadEquipements, updateEquipement, deleteEquipement, addEquipement })(ManageEquipementPage);