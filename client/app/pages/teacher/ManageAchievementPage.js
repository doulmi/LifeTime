import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Toolbar, MenuItem, IconButton, IconMenu, Paper, Dialog, FlatButton, CircularProgress, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui'
import { loadAchievements, updateAchievement, deleteAchievement } from '../../actions/achievementActions'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import { cyan500, grey500, grey900 } from 'material-ui/styles/colors'

import Paginator from '../../components/Paginator'
import SearchBar from '../../components/SearchBar'
import AchievementDialog from '../../components/AchievementDialog'

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

class ManageAchievementPage extends Component {
  constructor(props) {
    super(props);

    let query = this.props.location.query;
    let search = query.search;
    let student = query.student;

    this.state = {
      action: '',
      open: false,
      achievement: {},
      student: student == undefined ? '' : student,
      searchInput: search == '' || search == undefined ? '' : search,
    }

    this.props.loadAchievements(0, this.props.location.search);

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
    this.props.loadAchievements(0, this.getQuery())
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

  modifyDialog(achievement) {
    this.setState({
      action: 'modify',
      achievement: achievement,
      open: true 
    })
    this.refs.achievementDialog.setAchievement(achievement);
  }

  readDialog(achievement) {
    this.setState({
      action: 'read',
      open: true,
      achievement: achievement
    })
    this.refs.achievementDialog.setAchievement(achievement);
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
                      <TableHeaderColumn>{N18.achievementTitle}</TableHeaderColumn>
                      <TableHeaderColumn className="hidden-xs" style={{ width: 120 }}>{N18.studentName}</TableHeaderColumn>
                      <TableHeaderColumn className="hidden-xs" style={{ width: 120 }}>{N18.date}</TableHeaderColumn>
                      <TableHeaderColumn style={{ width: 80 }}>操作</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false} showRowHover={true}>
                    {this.props.achievements.map(achievement => (
                      <TableRow key={achievement._id}>
                        <TableRowColumn>{achievement.title}</TableRowColumn>
                        <TableRowColumn className="hidden-xs" style={{ width: 120 }}>{achievement.user && achievement.user.name}</TableRowColumn>
                        <TableRowColumn className="hidden-xs" style={{ width: 120 }} >{Timer.getYmd(new Date(achievement.happenAt))}</TableRowColumn>
                        <TableRowColumn style={{ width: 80 }}>
                          <IconMenu
                            useLayerForClickAway={true}
                            iconButtonElement={iconButtonElement}>
                            <MenuItem onTouchTap={() => this.readDialog(achievement)}>{N18.read}</MenuItem>
                            <MenuItem onTouchTap={() => this.modifyDialog(achievement)}>{N18.modify}</MenuItem>
                            <MenuItem onTouchTap={() => this.props.deleteAchievement(achievement)}>{N18.delete}</MenuItem>
                          </IconMenu>
                        </TableRowColumn>
                      </TableRow>
                    ))
                    }
                  </TableBody>
                </Table>

                <AchievementDialog
                  ref="achievementDialog"
                  open={this.state.open}
                  student={this.state.achievement.user == undefined ? {} : this.state.achievement.user}
                  closeCallback={this.closeCallback}
                  action={this.state.action}

                  updateAchievement={this.props.updateAchievement}
                  achievement={this.state.achievement}
                  />

                <Paginator
                  paginate={this.props.paginate}
                  query={this.props.location.search}
                  loadData={this.props.loadAchievements}
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
    achievements: state.achievements.achievements,
    paginate: state.achievements.paginate,
    isLoading: state.achievements.isLoading
  }
}

ManageAchievementPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, { loadAchievements, updateAchievement, deleteAchievement })(ManageAchievementPage)