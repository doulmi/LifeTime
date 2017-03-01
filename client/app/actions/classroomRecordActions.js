import axios from 'axios'

import { START_LOAD_CLASSROOMRECORDS, LOAD_CLASSROOMRECORDS, DELETE_CLASSROOMRECORD, ADD_CLASSROOMRECORD, UPDATE_CLASSROOMRECORD } from './types'
import { classroomRecordLoadNumber, serverUrl } from '../constants'

export function startLoadClassroomRecordsAction() {
  return {
    type: START_LOAD_CLASSROOMRECORDS,
    isLoading: true
  }
}

export function loadClassroomRecordsAction(classroomRecords, paginate) {
  return {
    type: LOAD_CLASSROOMRECORDS,
    classroomRecords: classroomRecords,
    paginate: paginate,
    isLoading: false,
  }
}

export function loadClassroomRecords(page, limit = classroomRecordLoadNumber) {
  return dispatch => {
    dispatch(startLoadClassroomRecordsAction());

    let url = serverUrl + 'classroomRecords/' + limit + '/' + page;
    axios.get(url).then(
      (res) => {
        let classroomRecords = res.data.classroomRecords;
        let total = res.data.total;
        let paginate = {
          total: total,
          limit: limit,
          currentPage: page,
          nextPage: page == total - 1 ? undefined : page + 1,
          prePage: page == 0 ? undefined : page - 1
        }
        dispatch(loadClassroomRecordsAction(classroomRecords, paginate));
      });
  }
}

export function addClassroomRecordAction(classroomRecord) {
  return {
    type: ADD_CLASSROOMRECORD,
    classroomRecord: classroomRecord
  }
}

export function addClassroomRecord(classroomRecord) {
  return dispatch => {
    return axios.post(serverUrl + 'classroomRecords', classroomRecord).then(
      (res) => {
        dispatch(addClassroomRecordAction(res.data.classroomRecord));
      })
  }
}

export function updateClassroomRecordAction(classroomRecord) {
  return {
    type: UPDATE_CLASSROOMRECORD,
    classroomRecord: classroomRecord
  }
}

export function updateClassroomRecord(classroomRecord) {
  return dispatch => {
    axios.put(serverUrl + 'classroomRecords/' + classroomRecord._id, classroomRecord).then(
      (res) => {
        dispatch(updateClassroomRecordAction(classroomRecord));
      })
  }
}


export function deleteClassroomRecordAction(classroomRecord) {
  return {
    type: DELETE_CLASSROOMRECORD,
    classroomRecord: classroomRecord
  }
}

export function deleteClassroomRecord(classroomRecord) {
  return dispatch => {
    axios.delete(serverUrl + "classroomRecords/" + classroomRecord._id).then(
      (res) => {
        dispatch(deleteClassroomRecordAction(classroomRecord));
      });
  }
}