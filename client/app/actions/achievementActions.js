import axios from 'axios'

import { START_LOAD_ACHIEVEMENTS, LOAD_ACHIEVEMENTS, DELETE_ACHIEVEMENT, ADD_ACHIEVEMENT, UPDATE_ACHIEVEMENT } from './types'
import { achievementLoadNumber, serverUrl } from '../constants'

export function startLoadAchievementsAction() {
  return {
    type: START_LOAD_ACHIEVEMENTS,
    isLoading: true
  }
}

export function loadAchievementsAction(achievements, paginate) {
  return {
    type: LOAD_ACHIEVEMENTS,
    achievements: achievements,
    paginate: paginate,
    isLoading: false,
  }
}

export function loadAchievements(page, query = '', limit = achievementLoadNumber) {
  return dispatch => {
    dispatch(startLoadAchievementsAction());

    let url = serverUrl + 'achievements/' + limit + '/' + page + query;
    axios.get(url).then(
      (res) => {
        let achievements = res.data.achievements;
        let total = res.data.total;
        let paginate = {
          total: total,
          limit: limit,
          currentPage: page,
          nextPage: page == total - 1 ? undefined : page + 1,
          prePage: page == 0 ? undefined : page - 1
        }
        dispatch(loadAchievementsAction(achievements, paginate));
      });
  }
}

export function addAchievementAction(achievement) {
  return {
    type: ADD_ACHIEVEMENT,
    achievement: achievement
  }
}

export function addAchievement(achievement) {
  return dispatch => {
    axios.post(serverUrl + 'achievements', achievement).then(
      (res) => {
        dispatch(addAchievementAction(res.data.achievement));
      })
  }
}

export function updateAchievementAction(achievement) {
  return {
    type: UPDATE_ACHIEVEMENT,
    achievement: achievement
  }
}

export function updateAchievement(achievement) {
  return dispatch => {
    axios.put(serverUrl + 'achievements/' + achievement._id, achievement).then(
      (res) => {
        dispatch(updateAchievementAction(res.data.achievement));
      })
  }
}


export function deleteAchievementAction(achievement) {
  return {
    type: DELETE_ACHIEVEMENT,
    achievement: achievement
  }
}

export function deleteAchievement(achievement) {
  return dispatch => {
    axios.delete(serverUrl + "achievements/" + achievement._id).then(
      (res) => {
        dispatch(deleteAchievementAction(achievement));
      });
  }
}