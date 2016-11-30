import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Toolbar, MenuItem, IconButton, IconMenu, Paper, Dialog, FlatButton, CircularProgress, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui'
import { loadPunishments, updatePunishment, deletePunishment } from '../../actions/punishmentActions'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import { cyan500, grey500, grey900 } from 'material-ui/styles/colors'

import Paginator from '../../components/Paginator'
import SearchBar from '../../components/SearchBar'
import PunishmentDialog from '../../components/PunishmentDialog'

import Timer from '../../utils/timer'
import N18 from '../../constants/string'

const styles = {
  top2: {
    marginTop: 30
  },
  toolbar: {
    padding: "0 30px 10px 30px",
    background: cyan500,
  }
}

class ManagePunishmentPage extends Component {
  constructor(props) {
    super(props);

    let query = this.props.location.query;
    let search = query.search;
    let student = query.student;

    this.state = {
      action: '',
      open: false,
      punishment: {},
      student: student == undefined ? '' : student,
      searchInput: search == '' || search == undefined ? '' : search,
    }

    // if (this.props.punishments == undefined || this.props.punishments.length == 0) {

    let page = 0;
    if(this.props.location.query.page != undefined) {
      page = this.props.location.query.page - 1;
    }
    this.props.loadPunishments(page, this.props.location.search);
    // }

    this.closeCallback = this.closeCallback.bind(this);
    this.modifyDialog = this.modifyDialog.bind(this);
    this.readDialog = this.readDialog.bind(this);
    this.search = this.search.bind(this);
    this.searchCallback = this.searchCallback.bind(this);
    this.clearCallback = this.clearCallback.bind(this);
    this.getQuery = this.getQuery.bind(this);
  }

  getQuery() {
    let queries = [];
    if (this.state.searchInput.trim() != '') {
      queries.push('search=' + this.state.searchInput.trim());
    }
    if (this.state.student != '') {
      queries.push('student=' + this.state.student);
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

  search() {
    this.context.router.push(this.props.location.pathname + this.getQuery());
    this.props.loadPunishments(0, this.getQuery())
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

  closeCallback() {
    this.setState({
      open: false
    })
  }

  modifyDialog(punishment) {
    this.setState({
      action: 'modify',
      punishment: punishment,
      open: true 
    })
    this.refs.punishmentDialog.setPunishment(punishment);
  }

  readDialog(punishment) {
    this.setState({
      action: 'read',
      open: true,
      punishment: punishment
    })
    this.refs.punishmentDialog.setPunishment(punishment);
  }

  render() {
    const progress = (
      <center style={styles.top2}><CircularProgress /></center>
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
    return (
      <Paper>
        <div style={styles.toolbar}>
          <SearchBar
            clearCallback={this.clearCallback}
            searchCallback={this.searchCallback}
            searchInput={this.state.searchInput}
            />
        </div>
        <div className="box">
          {this.props.isLoading ? progress :
            (
              <div>

                <Table >
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                    <TableRow selectable={false}>
                      <TableHeaderColumn>{N18.punishmentTitle}</TableHeaderColumn>
                      <TableHeaderColumn className="hidden-xs" style={{ width: 120 }}>{N18.studentName}</TableHeaderColumn>
                      <TableHeaderColumn className="hidden-xs" style={{ width: 120 }}>{N18.date}</TableHeaderColumn>
                      <TableHeaderColumn style={{ width: 80 }}>操作</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false} showRowHover={true}>
                    {this.props.punishments.map(punishment => (
                      <TableRow key={punishment._id}>
                        <TableRowColumn>{punishment.title}</TableRowColumn>
                        <TableRowColumn className="hidden-xs" style={{ width: 120 }}>{punishment.user && punishment.user.name}</TableRowColumn>
                        <TableRowColumn className="hidden-xs" style={{ width: 120 }} >{Timer.getYmd(new Date(punishment.happenAt))}</TableRowColumn>
                        <TableRowColumn style={{ width: 80 }}>
                          <IconMenu
                            useLayerForClickAway={true}
                            iconButtonElement={iconButtonElement}>
                            <MenuItem onTouchTap={() => this.readDialog(punishment)}>{N18.read}</MenuItem>
                            <MenuItem onTouchTap={() => this.modifyDialog(punishment)}>{N18.modify}</MenuItem>
                            <MenuItem onTouchTap={() => this.props.deletePunishment(punishment)}>{N18.delete}</MenuItem>
                          </IconMenu>
                        </TableRowColumn>
                      </TableRow>
                    ))
                    }
                  </TableBody>
                </Table>

                <PunishmentDialog
                  ref="punishmentDialog"
                  open={this.state.open}
                  student={this.state.punishment.user == undefined ? {} : this.state.punishment.user}
                  closeCallback={this.closeCallback}
                  action={this.state.action}

                  updatePunishment={this.props.updatePunishment}
                  punishment={this.state.punishment}
                  />

                <Paginator
                  paginate={this.props.paginate}
                  query={this.props.location.search}
                  loadData={this.props.loadPunishments}
                  />
              </div>
            )
          }
        </div>
      </Paper>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.auth,
    punishments: state.punishments.punishments,
    paginate: state.punishments.paginate,
    isLoading: state.punishments.isLoading
  }
}

ManagePunishmentPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, { loadPunishments, updatePunishment, deletePunishment })(ManagePunishmentPage)