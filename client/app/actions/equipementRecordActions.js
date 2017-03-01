import axios from 'axios'

import { START_LOAD_EQUIPEMENTRECORDS, LOAD_EQUIPEMENTRECORDS, DELETE_EQUIPEMENTRECORD, ADD_EQUIPEMENTRECORD, UPDATE_EQUIPEMENTRECORD } from './types'
import { equipementRecordLoadNumber, serverUrl } from '../constants'

export function startLoadEquipementRecordsAction() {
  return {
    type: START_LOAD_EQUIPEMENTRECORDS,
    isLoading: true
  }
}

export function loadEquipementRecordsAction(equipementRecords, paginate) {
  return {
    type: LOAD_EQUIPEMENTRECORDS,
    equipementRecords: equipementRecords,
    paginate: paginate,
    isLoading: false,
  }
}

export function loadEquipementRecords(equipement, page, limit = equipementRecordLoadNumber) {
  return dispatch => {
    dispatch(startLoadEquipementRecordsAction());

    let url = serverUrl + 'equipementRecords/' + equipement + '/' + limit + '/' + page;
    return axios.get(url).then(
      (res) => {
        let equipementRecords = res.data.equipementRecords;
        let total = res.data.total;
        let paginate = {
          total: total,
          limit: limit,
          currentPage: page,
          nextPage: page == total - 1 ? undefined : page + 1,
          prePage: page == 0 ? undefined : page - 1
        }
        dispatch(loadEquipementRecordsAction(equipementRecords, paginate));
      });
  }
}

export function addEquipementRecordAction(equipementRecord) {
  return {
    type: ADD_EQUIPEMENTRECORD,
    equipementRecord: equipementRecord
  }
}

export function addEquipementRecord(equipementRecord) {
  return dispatch => {
    return axios.post(serverUrl + 'equipementRecords', equipementRecord).then(
      (res) => {
        dispatch(addEquipementRecordAction(res.data.equipementRecord));
      })
  }
}

export function updateEquipementRecordAction(equipementRecord) {
  return {
    type: UPDATE_EQUIPEMENTRECORD,
    equipementRecord: equipementRecord
  }
}

export function updateEquipementRecord(equipementRecord) {
  return dispatch => {
    axios.put(serverUrl + 'equipementRecords/' + equipementRecord._id, equipementRecord).then(
      (res) => {
        dispatch(updateEquipementRecordAction(equipementRecord));
      })
  }
}


export function deleteEquipementRecordAction(equipementRecord) {
  return {
    type: DELETE_EQUIPEMENTRECORD,
    equipementRecord: equipementRecord
  }
}

export function deleteEquipementRecord(equipementRecord) {
  return dispatch => {
    axios.delete(serverUrl + "equipementRecords/" + equipementRecord._id).then(
      (res) => {
        dispatch(deleteEquipementRecordAction(equipementRecord));
      });
  }
}