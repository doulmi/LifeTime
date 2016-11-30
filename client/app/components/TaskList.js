import React, { Component } from 'react'
import { FlatButton, Dialog, IconMenu, MenuItem, IconButton, RaisedButton, CircularProgress, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import PlayArrow from 'material-ui/svg-icons/av/play-arrow'
import Delete from 'material-ui/svg-icons/action/delete'
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import Stop from 'material-ui/svg-icons/av/stop'
import { grey500, cyan50, blueGrey300, blueGrey400, red500, greenA700 } from 'material-ui/styles/colors'
import Timer from '../utils/timer'
import N18 from '../constants/string'

const styles = {
  table: {
    backgroundColor: 'transparent',
  },

  header: {
    marginTop: 40
  },

  hover: {
    background: '#EEEEEE'
  },

  container: {
    paddingLeft: 0,
    marginTop: 20,
    marginBottom: 60
  },

  top1: {
    marginTop: 40
  },

  footer: {
    padding: "0 30px 30px 30px"
  },

  time: {
    width: "100%",
    textAlign: 'right',
    fontSize: 16,
    position: 'relative',
    top: 10
  }
}
class TaskList extends Component {
  constructor(props) {
    super(props);

    this.deleteTask = this.deleteTask.bind(this);
    this.loadTasks = this.loadTasks.bind(this);

    this.state = {
      page: 1,
      isLoadingMore: false,
      openMore: false,
    }

    if (this.props.tasks.tasks.length == 0) {
      this.props.loadTasks(0);
    }
    this.openMore = this.openMore.bind(this);
    this.closeMore = this.closeMore.bind(this);
  }

  openMore(event) {
    this.setState({
      openMore: true,
      anchorEl: event.currentTarget,
    })
  }

  closeMore() {
    this.setState({
      openMore: true,
    });
  }

  deleteTask(task) {
    this.props.deleteTask(task);
  }

  loadTasks() {
    this.setState({ isLoadingMore: true });
    this.props.loadTasks(this.state.page).then((res) => {
      this.setState({ isLoadingMore: false })
    });
    this.setState({ page: this.state.page + 1 });
  }

  render() {
    let taskWithDate = {};
    // let tasks = this.props.tasks.tasks.sort((e1, e2) => {
      // return e1.created_at - e2.created_at
    // });
    let tasks = this.props.tasks.tasks;
    
    tasks.map(task => {
      if (taskWithDate[task.date] === undefined) {
        taskWithDate[task.date] = [];
      }
      taskWithDate[task.date].push(task);
    });

    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip={N18.more}
        tooltipPosition="bottom-left"
        >
        <MoreVertIcon color={grey500} />
      </IconButton>
    );

    let keys = Object.keys(taskWithDate).sort().reverse();
    const tables = keys.map(date => {
      const day = date.substr(0, 4) + '/' + date.substr(5, 2) + '/' + date.substr(8, 2);
      let tasks = taskWithDate[date].sort((e1, e2) => {return new Date(e2.created_at) - new Date(e1.created_at)});
      let time = 0;

      tasks.map(task => {
        time += Number(task.duration);
      })

      time = Timer.getHms(time);

      return (
        <div style={styles.header} key={day}>
          <Table style={styles.table} selectable={false}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
              <TableRow>
                <TableHeaderColumn><h3>{day}</h3></TableHeaderColumn>
                <TableHeaderColumn style={styles.time}>{time}</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} showRowHover={true}>
              {tasks.map((task) => {
                return (
                  <TableRow key={task._id}>
                    <TableRowColumn >{task.text}</TableRowColumn>
                    <TableRowColumn className="hidden-xs" ><Stop style={{ position: 'relative', top: 6 }} color={task.tag ? task.tag.color : 'transparent'} />{task.tag ? task.tag.name : ''}</TableRowColumn>
                    <TableRowColumn className="hidden-xs" width="120px">{task.startAt + '-' + task.stopAt}</TableRowColumn>
                    <TableRowColumn className="hidden-xs" width="100px">{Timer.hms(task.duration)}</TableRowColumn>
                    <TableRowColumn width="74px">
                      <IconMenu
                        iconButtonElement={iconButtonElement}>
                        <MenuItem onTouchTap={() => this.props.modifyTask(task)}>{N18.modify}</MenuItem>
                        <MenuItem onTouchTap={() => this.deleteTask(task)}>{N18.delete}</MenuItem>
                      </IconMenu>
                    </TableRowColumn>
                  </TableRow>
                )
              })}>
            </TableBody>
          </Table>
        </div>
      )
    });

    const progress = (
      <center><CircularProgress /></center>
    );

    const loadMoreBtn = (
      <div className="col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 col-xs-12">
        {this.props.tasks.noMore ?
          <center><span style={styles.footer}>{N18.noMore}</span></center> :
          <RaisedButton label={N18.loadMore} fullWidth={true} onTouchTap={this.loadTasks} />
        }
      </div>
    );

    return (
      <div style={styles.container}>
        {tables}
        <div style={styles.top1} />
        {this.state.isLoadingMore ? progress : loadMoreBtn}
        <div style={{ height: 100 }} />
      </div>
    )
  }
}

TaskList.propTypes = {
  loadTasks: React.PropTypes.func.isRequired,
  tasks: React.PropTypes.object.isRequired,
  deleteTask: React.PropTypes.func.isRequired,
  modifyTask: React.PropTypes.func.isRequired
}

export default TaskList