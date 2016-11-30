import axios from 'axios'

import { START_LOAD_PUNISHMENTS, LOAD_PUNISHMENTS, DELETE_PUNISHMENT, ADD_PUNISHMENT, UPDATE_PUNISHMENT } from './types'
import { punishmentLoadNumber, serverUrl } from '../constants'

export function startLoadPunishmentsAction() {
  return {
    type: START_LOAD_PUNISHMENTS,
    isLoading: true
  }
}

export function loadPunishmentsAction(punishments, paginate) {
  return {
    type: LOAD_PUNISHMENTS,
    punishments: punishments,
    paginate: paginate,
    isLoading: false,
  }
}

export function loadPunishments(page, query = '', limit = punishmentLoadNumber) {
  return dispatch => {
    dispatch(startLoadPunishmentsAction());

    let url = serverUrl + 'punishments/' + limit + '/' + page + query;
    axios.get(url).then(
      (res) => {
        let punishments = res.data.punishments;
        let total = res.data.total;
        let paginate = {
          total: total,
          limit: limit,
          currentPage: page,
          nextPage: page == total - 1 ? undefined : page + 1,
          prePage: page == 0 ? undefined : page - 1
        }
        dispatch(loadPunishmentsAction(punishments, paginate));
      });
  }
}

export function addPunishmentAction(punishment) {
  return {
    type: ADD_PUNISHMENT,
    punishment: punishment
  }
}

export function addPunishment(punishment) {
  return dispatch => {
    axios.post(serverUrl + 'punishments', punishment).then(
      (res) => {
        dispatch(addPunishmentAction(res.data.punishment));
      })
  }
}

export function updatePunishmentAction(punishment) {
  return {
    type: UPDATE_PUNISHMENT,
    punishment: punishment
  }
}

export function updatePunishment(punishment) {
  return dispatch => {
    axios.put(serverUrl + 'punishments/' + punishment._id, punishment).then(
      (res) => {
        dispatch(updatePunishmentAction(res.data.punishment));
      })
  }
}


export function deletePunishmentAction(punishment) {
  return {
    type: DELETE_PUNISHMENT,
    punishment: punishment
  }
}

export function deletePunishment(punishment) {
  return dispatch => {
    axios.delete(serverUrl + "punishments/" + punishment._id).then(
      (res) => {
        dispatch(deletePunishmentAction(punishment));
      });
  }
}