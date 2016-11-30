import axios from 'axios'

import { LOAD_CLASSES, START_LOAD_CLASSES, ADD_CLASS, UPDATE_CLASS, DELETE_CLASS } from './types'
import { serverUrl } from '../constants'

export function loadClassesAction(classes) {
  return {
    type: LOAD_CLASSES,
    classes: classes,
  }
}

export function loadClasses(query = '') {
  return dispatch => {
    axios.get(serverUrl + 'class' + query).then(
      (res) => {
      let classes = res.data.classes;
      dispatch(loadClassesAction(classes));
    });
  }
}

export function deleteClassAction(cls) {
  return {
    type: DELETE_CLASS,
    cls : cls
  }
}

export function deleteClass(cls) {
  return dispatch => {
    axios.delete(serverUrl + 'class/' + cls._id).then(
      (res) => {
      dispatch(deleteClassAction(cls));
    });
  }
}

export function addClassAction(cls) {
  return {
    type: ADD_CLASS,
    cls: cls
  }
}

export function addClass(cls) {
  return dispatch => {
    axios.post(serverUrl + 'class', cls).then(
      (res) => {
        dispatch(addClassAction(res.data.cls));
      }
    )
  }
}

export function updateClassAction(cls) {
  return {
    type: UPDATE_CLASS,
    cls: cls
  }
}

export function updateClass(cls) {
  return dispatch => {
    axios.put(serverUrl + 'class/' + cls._id, cls).then(
      (res) => {
        dispatch(updateClassAction(cls));
      }
    )
  }
}