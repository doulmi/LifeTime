import axios from 'axios'

import { LOAD_STUDENTS_CHECKS, LOAD_CHECKS, DELETE_CHECK, ADD_CHECK, UPDATE_CHECK, START_LOAD_CHECKS } from './types'
import { serverUrl } from '../constants'

export function loadCheckUpByClassAction(studentChecks) {
  return {
    type: LOAD_STUDENTS_CHECKS,
    studentChecks : studentChecks 
  }  
}

export function loadCheckUpByClass(classId, courseId) {
  return dispatch => {
    let url = serverUrl + 'checks/' + classId + '/' + courseId;
    return axios.get(url).then(
      res => {
        dispatch(loadCheckUpByClassAction(res.data.studentChecks))
      }
    )
  }
}

export function saveChecks(schedualId, classId, checks) {
  return dispatch => {
    let url = serverUrl + 'checks/schedual/saveAll';
    return axios.post(url, {schedualId, classId, checks});
  }  
}

export function loadChecksBySchedual(schedualId) {
  return dispatch => {
    let url = serverUrl + 'checks/schedual/' + schedualId;
    return axios.get(url).then(
      res => {
        dispatch(loadChecksAction(res.data.checks));
      });
  }
}

export function startLoadChecksAction() {
  return {
    type: START_LOAD_CHECKS,
  }
}

export function loadChecksAction(checks) {
  return {
    type: LOAD_CHECKS,
    checks: checks
  }
}

export function loadChecks(studentId) {
  return dispatch => {
    axios.get(serverUrl + 'checks/' + studentId).then(
      (res) => {
        let checks = res.data.checks;
        dispatch(loadChecksAction(checks));
      });
  }
}

export function addCheckAction(check) {
  return {
    type: ADD_CHECK,
    check: check
  }
}

export function addCheck(check) {
  return dispatch => {
    axios.post(serverUrl + 'checks', check).then(
      (res) => {
        dispatch(addCheckAction(res.data.check));
      })
  }
}

export function updateCheckAction(checks) {
  return {
    type: UPDATE_CHECK,
    checks: checks
  }
}

export function updateCheck(check) {
  return dispatch => {
    axios.put(serverUrl + 'checks/' + check.id, check).then(
      (res) => {
        dispatch(updateCheckAction(res.data.checks));
      })
  }
}