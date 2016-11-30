import axios from 'axios'

import { ADD_USER_CALLBACK, START_LOAD_USER, LOAD_USER } from './types'
import { serverUrl } from '../constants'
import { updateStudentAction, addStudentAction, deleteStudentAction } from './studentActions'
import { updateTeacherAction, addTeacherAction, deleteTeacherAction } from './teacherActions'
import { updateCurrentUser } from './authActions'

export function startLoadUserAction() {
  return {
    type: START_LOAD_USER
  }
}

export function loadUserAction(user) {
  return {
    type: LOAD_USER,
    user: user
  }
}

export function loadUser(id) {
  return dispatch => {
    dispatch(startLoadUserAction());
    let url = serverUrl + 'users/' + id;
    axios.get(url).then(
      (res) => {
        let user = res.data.user;
        dispatch(loadUserAction(user));
      });
  }
}

export function addUser(user, type) {
  return dispatch => {
    let url = serverUrl + 'users/' + type;
    axios.post(url, user).then((res) => {
      if (type == 'student') {
        dispatch(addStudentAction(res.data.user));
      } else {
        dispatch(addTeacherAction(res.data.user));
      }
    })
  }
}

export function updateUser(user, type) {
  return dispatch => {
    let url = serverUrl + 'users/' + type;
    axios.put(url, user).then(
      res => {
        if (type == 'student') {
          dispatch(updateStudentAction(res.data.user));
        } else {
          dispatch(updateTeacherAction(res.data.user));
        }
      }
    )
  }
}

export function deleteUser(user, type) {
  return dispatch => {
    let url = serverUrl + 'users/' + user._id;
    axios.delete(url, user).then(
      res => {
        if (type == 'student') {
          dispatch(deleteStudentAction(res.data.user));
        } else {
          dispatch(deleteTeacherAction(res.data.user));
        }
      }
    )
  }
}

export function updateUserInfo(user) {
  return dispatch => {
    let url = serverUrl + 'users/updateInfo/' + user._id;
    return axios.put(url, user).then(
      res => {
        dispatch(updateCurrentUser(user));
      }
    )
  }
}

export function modifyPassword(user) {
  return dispatch => {
    let url = serverUrl + 'users/modifyPassword/' + user._id;
    return axios.put(url, user);
  }
}