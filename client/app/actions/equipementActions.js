import axios from 'axios'

import { START_LOAD_EQUIPEMENTS, LOAD_EQUIPEMENTS, DELETE_EQUIPEMENT, ADD_EQUIPEMENT, UPDATE_EQUIPEMENT, LOAD_ALL_EQUIPEMENTS } from './types'
import { equipementLoadNumber, serverUrl } from '../constants'

export function startLoadEquipementsAction() {
  return {
    type: START_LOAD_EQUIPEMENTS,
    isLoading: true
  }
}

export function loadEquipementsAction(equipements, paginate) {
  return {
    type: LOAD_EQUIPEMENTS,
    equipements: equipements,
    paginate: paginate,
    isLoading: false,
  }
}

export function loadAllEquipementsAction(equipements) {
  return {
    type: LOAD_ALL_EQUIPEMENTS,
    equipements: equipements
  }
}

export function loadAllEquipements() {
  return dispatch => {
    let url = serverUrl + 'equipements';
    return axios.get(url).then(
      (res) => {
        dispatch(loadAllEquipementsAction(res.data.equipements));
      }
    )
  };
}

export function loadEquipements(page, limit = equipementLoadNumber) {
  return dispatch => {
    dispatch(startLoadEquipementsAction());

    let url = serverUrl + 'equipements/' + limit + '/' + page;
    axios.get(url).then(
      (res) => {
        let equipements = res.data.equipements;
        let total = res.data.total;
        let paginate = {
          total: total,
          limit: limit,
          currentPage: page,
          nextPage: page == total - 1 ? undefined : page + 1,
          prePage: page == 0 ? undefined : page - 1
        }
        dispatch(loadEquipementsAction(equipements, paginate));
      });
  }
}

export function addEquipementAction(equipement) {
  return {
    type: ADD_EQUIPEMENT,
    equipement: equipement
  }
}

export function addEquipement(equipement) {
  return dispatch => {
    axios.post(serverUrl + 'equipements', equipement).then(
      (res) => {
        dispatch(addEquipementAction(res.data.equipement));
      })
  }
}

export function updateEquipementAction(equipement) {
  return {
    type: UPDATE_EQUIPEMENT,
    equipement: equipement
  }
}

export function updateEquipement(equipement) {
  return dispatch => {
    axios.put(serverUrl + 'equipements/' + equipement._id, equipement).then(
      (res) => {
        dispatch(updateEquipementAction(res.data.equipement));
      })
  }
}

export function deleteEquipementAction(equipement) {
  return {
    type: DELETE_EQUIPEMENT,
    equipement: equipement
  }
}

export function deleteEquipement(equipement) {
  return dispatch => {
    axios.delete(serverUrl + "equipements/" + equipement._id).then(
      (res) => {
        dispatch(deleteEquipementAction(equipement));
      });
  }
}