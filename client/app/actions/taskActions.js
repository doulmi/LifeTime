import axios from 'axios'

import { ADD_TASK, LOAD_TASKS, DELETE_TASK, LOAD_TASKS_DATE, START_FETCH_TASKS, FETCH_TASKS } from './types'
import Timer from '../utils/timer'
import { loadNumber, serverUrl } from '../constants'

export function addTaskAction(task) {
  return {
    type: ADD_TASK,
    task: task
  }
}

export function stopTask(task) {
  return (dispatch) => {
    return axios.post(serverUrl + 'tasks', task).then(
      (res) => {
      dispatch(addTaskAction(res.data.task));
    });
  }
}

export function loadTaskAction(tasks, noMore) {
  return {
    type: LOAD_TASKS,
    tasks: tasks,
    noMore: noMore
  }
}

export function loadTasks(page, limit = loadNumber) {
  return (dispatch) => {
    return axios.get(serverUrl + 'tasks/' + limit + '/' + page).then(
      (res) => {
        let tasks = res.data.tasks;
        let noMore = tasks.length == 0;
        dispatch(loadTaskAction(tasks, noMore));
      }
    )
  }
}

export function loadTaskByDateAction(tasks) {
  return {
    type: LOAD_TASKS_DATE,
    tasks: tasks
  }
}

export function loadTaskByDate(start, end) {
  return (dispatch) => {
    return axios.get(serverUrl + 'tasks/date/' + start + '/' + end).then(
      (res) => {
        let tasks = res.data.tasks;
        dispatch(loadTaskByDateAction(tasks));
      }
    )
  }  
}

export function deleteTaskAction(task) {
  return {
    type: DELETE_TASK,
    task: task
  }
}

export function deleteTask(task) {
  return dispatch => {
    axios.delete( serverUrl + 'tasks/' + task._id).then(
      (res) => {
        dispatch(deleteTaskAction(task))
      }
    );
  }
}

export function startFetchTasksAction() {
  return {
    type: START_FETCH_TASKS
  }
}

export function fetchTasks(userId, start, stop) {
  return dispatch => {
    dispatch(startFetchTasksAction());
    axios.get( serverUrl + 'tasks/fetch/' + userId + '/' + start + '/' + stop).then(
      (res) => {
        dispatch(loadTaskByDateAction(res.data.tasks));
      }
    )
  }
}