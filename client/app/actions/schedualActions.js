import axios from 'axios'

import {LOAD_SCHEDUAL, START_LOAD_SCHEDUALS, LOAD_SCHEDUALS, DELETE_SCHEDUAL, ADD_SCHEDUAL, UPDATE_SCHEDUAL } from './types'
import { schedualLoadNumber, serverUrl } from '../constants'

export function arrangeSchedual() {
  return dispatch => {
    let url = serverUrl + 'scheduals/arrangeSchedual';
    return axios.post(url);
  }
}
export function startLoadSchedualsAction() {
  return {
    type: START_LOAD_SCHEDUALS,
  }
}

export function loadSchedualByIdAction(schedual) {
  return {
    type: LOAD_SCHEDUAL,
    schedual: schedual
  }
}
export function loadSchedualById(id){
  return dispatch => {
    let url = serverUrl + 'scheduals/' + id;
    return axios.get(url).then(
      res => {
        dispatch(loadSchedualByIdAction(res.data.schedual));
      }
    )
  } 
}

export function loadSchedualsAction(scheduals, paginate) {
  return {
    type: LOAD_SCHEDUALS,
    scheduals: scheduals,
  }
}

export function loadTeacherScheduals(id, start, end) {
  return dispatch => {
    let url = serverUrl + 'scheduals/teacher/' + id + '/' + start + '/' + end;
    return axios.get(url).then(
      res => {
        dispatch(loadSchedualsAction(res.data.scheduals));
      }
    )
  }  
}

export function loadScheduals(classId, start, end) {
  return dispatch => {
    dispatch(startLoadSchedualsAction());

    let url = serverUrl + 'scheduals/' + classId + '/' + start + '/' + end;
    return axios.get(url).then(
      (res) => {
        let scheduals = res.data.scheduals;
        dispatch(loadSchedualsAction(scheduals));
      });
  }
}

export function addSchedualAction(schedual) {
  return {
    type: ADD_SCHEDUAL,
    schedual: schedual
  }
}

export function addSchedual(schedual) {
  return dispatch => {
    return axios.post(serverUrl + 'scheduals/' + schedual.class, schedual).then(
      (res) => {
        dispatch(addSchedualAction(res.data.schedual));
      })
  }
}

export function updateSchedualAction(schedual) {
  return {
    type: UPDATE_SCHEDUAL,
    schedual: schedual
  }
}

export function updateSchedual(schedual) {
  return dispatch => {
    return axios.put(serverUrl + 'scheduals/' + schedual._id, schedual).then(
      (res) => {
        dispatch(updateSchedualAction(res.data.schedual));
      })
  }
}

export function deleteSchedualAction(schedual) {
  return {
    type: DELETE_SCHEDUAL,
    schedual: schedual
  }
}

export function deleteSchedual(schedual) {
  return dispatch => {
    return axios.delete(serverUrl + "scheduals/" + schedual._id).then(
      (res) => {
        dispatch(deleteSchedualAction(schedual));
      });
  }
}