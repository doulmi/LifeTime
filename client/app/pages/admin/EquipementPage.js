import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Paper, IconButton, FlatButton, RadioButtonGroup, RadioButton, Checkbox, TextField, IconMenu, RaisedButton, DatePicker, MenuItem, Table, TableBody, TableHeader, TableRowColumn, TableHeaderColumn, TableRow, TableRowColum } from 'material-ui'
import { loadUser } from '../../actions/userActions'
import { loadAllClasses } from '../../actions/classActions'
import { loadEquipementRecords, deleteEquipementRecord } from '../../actions/equipementRecordActions'
import NavigationArrowBack from 'material-ui/svg-icons//navigation/arrow-back'
import Paginator from '../../components/Paginator'
import { cyan500 } from 'material-ui/styles/colors'
import LoadingProgress from '../../components/LoadingProgress'
import AutoSelectField from '../../components/AutoSelectField'

import N18 from '../../constants/string'
import DateTimeFormat from '../../constants/format'

const styles = {
  toolbar: {
    padding: 10,
    background: cyan500,
  },

  buttons: {
    marginTop: 8,
    float: 'right'

  }
}

class EquipementPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0
    }
  }

  componentWillMount() {
    //equipement id
    let id = this.props.params.id;
    this.props.loadEquipementRecords(id, 0);
    this.setState({ page: 1 });
  }

  goBack() {
    this.context.router.push({
      pathname: '/ManageEquipement'
    })
  }

  validReturn() {
    console.log('valid returned');    
  }

  readEquipementRecord() {
    console.log('read record');
  }


  render() {
    return (
      <Paper>
        <div style={styles.toolbar}>
          <IconButton tooltip={N18.back} onTouchTap={() => this.goBack()} >
            <NavigationArrowBack color="white" />
          </IconButton>
        </div>
        <div className="box">
          {this.props.isLoading ? <LoadingProgress /> :
            (this.props.records.length == 0 ? 
            <div>
              {N18.noHistory}
            </div>
            : 
            <div>
              <Table>
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                    <TableRow selectable={false}>
                      <TableHeaderColumn>{N18.equipementName}</TableHeaderColumn>
                      <TableHeaderColumn>{N18.equipementStartAt}</TableHeaderColumn>
                      <TableHeaderColumn>{N18.equipementEndAt}</TableHeaderColumn>
                      <TableHeaderColumn>{N18.returned}</TableHeaderColumn>
                      <TableHeaderColumn style={{ width: 80 }}>{N18.operations}</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false} showRowHover={true}>
                    {this.props.records.map(record => (
                      <TableRow key={record._id}>
                        <TableRowColumn>{record.name}</TableRowColumn>
                        <TableRowColumn>{record.start_at}</TableRowColumn>
                        <TableRowColumn>{record.end_at}</TableRowColumn>
                        <TableRowColumn style={{ width: 80 }}>
                          <IconMenu useLayerForClickAway={true} iconButtonElement={iconButtonElement}>
                            <MenuItem onTouchTap={() => this.validReturn(record)}>{N18.validReturn}</MenuItem>
                            <MenuItem onTouchTap={() => this.readEquipementRecord(record)}>{N18.modify}</MenuItem>
                            <MenuItem onTouchTap={() => this.props.deleteEquipementRecord(record)}>{N18.delete}</MenuItem>
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
      </Paper >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    records: state.equipementRecords.equipementRecords,
    isLoading: state.equipementRecords.isLoading,
  }
}

EquipementPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, { loadEquipementRecords, deleteEquipementRecord })(EquipementPage)