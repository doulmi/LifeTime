import React, { Component } from 'react'
import { connect } from 'react-redux'
import TaskInput from '../components/TaskInput'
import TaskList from '../components/TaskList'
import Paper from 'material-ui/Paper'
import { stopTask, loadTasks, deleteTask } from '../actions/taskActions'
import { loadTags, addTag } from '../actions/tagActions'

class TaskPage extends Component {
  constructor(props) {
    super(props);
    this.modifyTask = this.modifyTask.bind(this);
  }

  modifyTask(task) {
    this.refs.input.changeCurrentTask(task);
    this.props.deleteTask(task);
  }

  render() {
    return (
      <Paper>
        <div className="box">
          <TaskInput ref="input" stopTask={this.props.stopTask} tags={this.props.tags} loadTags={this.props.loadTags} addTag={this.props.addTag} />
          <TaskList tasks={this.props.tasks} deleteTask={this.props.deleteTask} loadTasks={this.props.loadTasks} modifyTask={this.modifyTask} />
        </div>
      </Paper>
    )
  }
}

TaskPage.propTypes = {
  stopTask: React.PropTypes.func.isRequired,
  deleteTask: React.PropTypes.func.isRequired,
  loadTasks: React.PropTypes.func.isRequired,
  tasks: React.PropTypes.object.isRequired,

  loadTags: React.PropTypes.func.isRequired,
  addTag: React.PropTypes.func.isRequired,
  tags: React.PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
  return {
    tasks: state.tasks,
    tags: state.tags.tags,
  }
}
export default connect(mapStateToProps, { stopTask, deleteTask, loadTasks, loadTags, addTag })(TaskPage)