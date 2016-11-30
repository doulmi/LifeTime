import axios from 'axios'

import { LOAD_SCORES, DELETE_SCORE, ADD_SCORE, UPDATE_SCORE, START_LOAD_SCORES } from './types'
import { serverUrl } from '../constants'

export function saveScores(courseId, scores) {
  return dispatch => {
    let url = serverUrl + 'scores/saveAll';
    return axios.post(url, {courseId, scores});
  }  
}

export function loadScoresByClass(classId, courseId) {
  return dispatch => {
    let url = serverUrl + 'scores/' + courseId + '/' + classId;
    return axios.get(url).then(
      res => {
        dispatch(loadScoresAction(res.data.scores));
      });
  }
}

export function startLoadScoresAction() {
  return {
    type: START_LOAD_SCORES,
  }
}

export function loadScoresAction(scores) {
  return {
    type: LOAD_SCORES,
    scores: scores
  }
}

export function loadScores(studentId) {
  return dispatch => {
    axios.get(serverUrl + 'scores/' + studentId).then(
      (res) => {
        let scores = res.data.scores;
        dispatch(loadScoresAction(scores));
      });
  }
}

export function addScoreAction(score) {
  return {
    type: ADD_SCORE,
    score: score
  }
}

export function addScore(score) {
  return dispatch => {
    axios.post(serverUrl + 'scores', score).then(
      (res) => {
        dispatch(addScoreAction(res.data.score));
      })
  }
}

export function updateScoreAction(scores) {
  return {
    type: UPDATE_SCORE,
    scores: scores
  }
}

export function updateScore(score) {
  return dispatch => {
    axios.put(serverUrl + 'scores/' + score.id, score).then(
      (res) => {
        dispatch(updateScoreAction(res.data.scores));
      })
  }
}


export function deleteScoreAction(score) {
  return {
    type: DELETE_SCORE,
    score: score
  }
}

export function deleteScore(score) {
  return dispatch => {
    axios.delete(serverUrl + "scores/" + score._id).then(
      (res) => {
        dispatch(deleteScoreAction(score));
      });
  }
}