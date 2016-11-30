import axios from 'axios'

import { LOAD_OPTIQUES, DELETE_OPTIQUE, ADD_OPTIQUE, UPDATE_OPTIQUE, FETCH_OPTIQUES, START_FETCH_OPTIQUES, START_LOAD_OPTIQUES } from './types'
import { serverUrl } from '../constants'

export function startLoadOptiquesAction() {
  return {
    type: START_LOAD_OPTIQUES
  }
}

export function loadOptiquesAction(optiques) {
  return {
    type: LOAD_OPTIQUES,
    optiques: optiques
  }
}

export function loadOptiques() {
  return dispatch => {
    dispatch(startLoadOptiquesAction());
    axios.get(serverUrl + 'optiques').then(
      (res) => {
      let optiques = res.data.optiques;
      dispatch(loadOptiquesAction(optiques));
    });
  }
}

export function addOptiqueAction(optique) {
  return {
    type: ADD_OPTIQUE,
    optique: optique
  }
}

export function addOptique(optique) {
  return dispatch => {
    axios.post(serverUrl + 'optiques', optique).then(
      (res) => {
      dispatch(addOptiqueAction(res.data.optique));
    })
  }
}

export function updateOptiqueAction(optiques) { 
  return {
    type: UPDATE_OPTIQUE,
    optiques: optiques
  }
}

export function updateOptique(optique) {
  return dispatch => {
    axios.put(serverUrl + 'optiques/' + optique.id, optique).then(
      (res) => {
      dispatch(updateOptiqueAction(res.data.optiques));
    }) 
  }
}


export function deleteOptiqueAction(optique) {
  return {
    type: DELETE_OPTIQUE,
    optique: optique
  }
}

export function deleteOptique(optique) {
  return dispatch => {
    axios.delete(serverUrl + "optiques/" + optique._id).then(
      (res) => {
      dispatch(deleteOptiqueAction(optique));  
    });
  }
}

export function startFetchOptiquesAction() {
  return {
    type: START_FETCH_OPTIQUES
  }
}

export function fetchOptiquesAction(optiques) {
  return {
    type: FETCH_OPTIQUES,
    optiques: optiques
  }
}

//教师端查询用户视力
export function fetchOptiques(studentId) {
  return dispatch => {
    dispatch(startFetchOptiquesAction());
    const url = serverUrl + "optiques/fetch/" + studentId;
    axios.get(url).then(
      (res) => {
        dispatch(fetchOptiquesAction(res.data.optiques))
      }  
    )
  }
}