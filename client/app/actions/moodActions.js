import axios from 'axios'

import { LOAD_MOODS, DELETE_MOOD, ADD_MOOD, UPDATE_MOOD, START_LOAD_MOODS, FETCH_MOODS, START_FETCH_MOODS } from './types'
import { loadNumber, serverUrl } from '../constants'

export function startLoadMoodsAction() {
  return {
    type: START_LOAD_MOODS
  }
}

export function loadMoodsAction(moods, noMore) {
  return {
    type: LOAD_MOODS,
    moods: moods,
    noMore: noMore
  }
}

export function loadMoods(page, limit = loadNumber) {
  return dispatch => {
    dispatch(startLoadMoodsAction());
    axios.get(serverUrl + 'moods/' + limit + '/' + page).then(
      (res) => {
      let moods = res.data.moods;
      let noMore = moods.length == 0;
      dispatch(loadMoodsAction(moods, noMore));
    });
  }
}

export function addMoodAction(mood) {
  return {
    type: ADD_MOOD,
    mood: mood
  }
}

export function addMood(mood) {
  return dispatch => {
    axios.post(serverUrl + 'moods', mood).then(
      (res) => {
      dispatch(addMoodAction(res.data.mood));
    })
  }
}

export function deleteMoodAction(mood) {
  return {
    type: DELETE_MOOD,
    mood: mood
  }
}

export function deleteMood(mood) {
  return dispatch => {
    axios.delete(serverUrl + "moods/" + mood._id).then(
      (res) => {
      dispatch(deleteMoodAction(mood));
    });
  }
}

export function startFetchMoodsAction() {
  return {
    type: START_FETCH_MOODS
  }
}
export function fetchMoodsAction(moods) {
  return {
    type: FETCH_MOODS,
    moods: moods
  }
}

//教师端查询用户视力
export function fetchMoods(studentId) {
  return dispatch => {
    dispatch(startFetchMoodsAction());
    const url = serverUrl + "moods/fetch/" + studentId;
    axios.get(url).then(
      (res) => {
        dispatch(fetchMoodsAction(res.data.moods))
      }  
    )
  }
}