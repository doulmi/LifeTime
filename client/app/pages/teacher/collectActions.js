import axios from 'axios'

import { ADD_STUDENT_TO_COLLECT, LOAD_NOT_SUBMIT_COLLECTS, DELETE_STDEUNT_FROM_COLLECT, START_LOAD_COLLECTS, LOAD_COLLECTS, DELETE_COLLECT, ADD_COLLECT, UPDATE_COLLECT, START_LOAD_COLLECT, LOAD_COLLECT } from './types'
import { collectLoadNumber, serverUrl } from '../constants'

export function startLoadCollectsAction() {
  return {
    type: START_LOAD_COLLECTS,
    isLoading: true
  }
}

export function loadCollectsAction(collects, paginate) {
  return {
    type: LOAD_COLLECTS,
    collects: collects,
    paginate: paginate,
    isLoading: false,
  }
}

export function loadCollects(page, query = '', limit = collectLoadNumber) {
  return dispatch => {
    dispatch(startLoadCollectsAction());

    let url = serverUrl + 'collects/' + limit + '/' + page + query;
    axios.get(url).then(
      (res) => {
        let collects = res.data.collects;
        let total = res.data.total;
        let paginate = {
          total: total,
          limit: limit,
          currentPage: page,
          nextPage: page == total - 1 ? undefined : page + 1,
          prePage: page == 0 ? undefined : page - 1
        }
        dispatch(loadCollectsAction(collects, paginate));
      });
  }
}

export function addCollectAction(collect) {
  return {
    type: ADD_COLLECT,
    collect: collect
  }
}

export function addCollect(collect) {
  return dispatch => {
    return axios.post(serverUrl + 'collects', collect).then(
      (res) => {
        dispatch(addCollectAction(res.data.collect));
      })
  }
}

export function updateCollectAction(collect) {
  return {
    type: UPDATE_COLLECT,
    collect: collect
  }
}

export function updateCollect(collect) {
  return dispatch => {
    axios.put(serverUrl + 'collects/' + collect._id, collect).then(
      (res) => {
        dispatch(updateCollectAction(collect));
      })
  }
}


export function deleteCollectAction(collect) {
  return {
    type: DELETE_COLLECT,
    collect: collect
  }
}

export function deleteCollect(collect) {
  return dispatch => {
    axios.delete(serverUrl + "collects/" + collect._id).then(
      (res) => {
        dispatch(deleteCollectAction(collect));
      });
  }
}

export function addStudentToCollectAction(collectId, studentId) {
  return {
    type: ADD_STUDENT_TO_COLLECT,
    collectId: collectId,
    studentId: studentId
  }
}

export function addStudentToCollect(collectId, studentId) {
  return dispatch => {
    axios.put(serverUrl + 'collects/' + collectId + '/' + studentId).then(
      (res) => {
        dispatch(addStudentToCollectAction(collectId, studentId));
      }
    )
  }  
}

export function deleteStudentFromCollectAction(collectId, studentId) {
  return {
    type: DELETE_STDEUNT_FROM_COLLECT,
    collectId: collectId,
    studentId: studentId
  }
}

export function deleteStudentFromCollect(collectId, studentId) {
  return dispatch => {
    axios.delete(serverUrl + 'collects/' + collectId + '/' + studentId).then(
      (res) => {
        dispatch(deleteStudentFromCollectAction(collectId, studentId));
      }
    )
  }
}

export function startLoadCollectAction(collect) {
  return {
    type: START_LOAD_COLLECT
  }
}

export function loadCollectAction(collect) {
  return {
    type: LOAD_COLLECT,
    collect: collect
  }
}

export function loadCollect(collectId) {
  return dispatch => {
    dispatch(startLoadCollectAction());
    axios.get(serverUrl + 'collects/' + collectId).then(
      (res) => {
        dispatch(loadCollectAction(res.data.collect))
      }
    )
  }
}

export function loadNotSubmitCollectsAction(collects) {
  return {
    type: LOAD_NOT_SUBMIT_COLLECTS,
    collects: collects
  }
}

export function loadNotSubmitCollects(userId) {
  return dispatch => {
    axios.get(serverUrl + 'collects/notsubmit/' + userId).then(
      (res) => {
        dispatch(loadNotSubmitCollectsAction(res.data.collects));
      }
    )
  }
}