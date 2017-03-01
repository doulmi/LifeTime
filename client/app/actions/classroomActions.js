import axios from 'axios'

import { START_LOAD_CLASSROOMS, LOAD_CLASSROOMS, DELETE_CLASSROOM, ADD_CLASSROOM, UPDATE_CLASSROOM, LOAD_ALL_CLASSROOMS } from './types'
import { classroomLoadNumber, serverUrl } from '../constants'

export function startLoadClassroomsAction() {
  return {
    type: START_LOAD_CLASSROOMS,
    isLoading: true
  }
}

export function loadClassroomsAction(classrooms, paginate) {
  return {
    type: LOAD_CLASSROOMS,
    classrooms: classrooms,
    paginate: paginate,
    isLoading: false,
  }
}

export function loadAllClassroomsAction(classrooms) {
  return {
    type: LOAD_ALL_CLASSROOMS,
    classrooms: classrooms
  }
}

export function loadAllClassrooms() {
  return dispatch => {
    let url = serverUrl + 'classrooms';
    return axios.get(url).then(
      (res) => {
        dispatch(loadAllClassroomsAction(res.data.classrooms));
      }
    )
  };
}

export function loadClassrooms(page, limit = classroomLoadNumber) {
  return dispatch => {
    dispatch(startLoadClassroomsAction());

    let url = serverUrl + 'classrooms/' + limit + '/' + page;
    axios.get(url).then(
      (res) => {
        let classrooms = res.data.classrooms;
        let total = res.data.total;
        let paginate = {
          total: total,
          limit: limit,
          currentPage: page,
          nextPage: page == total - 1 ? undefined : page + 1,
          prePage: page == 0 ? undefined : page - 1
        }
        dispatch(loadClassroomsAction(classrooms, paginate));
      });
  }
}

export function addClassroomAction(classroom) {
  return {
    type: ADD_CLASSROOM,
    classroom: classroom
  }
}

export function addClassroom(classroom) {
  return dispatch => {
    axios.post(serverUrl + 'classrooms', classroom).then(
      (res) => {
        dispatch(addClassroomAction(res.data.classroom));
      })
  }
}

export function updateClassroomAction(classroom) {
  return {
    type: UPDATE_CLASSROOM,
    classroom: classroom
  }
}

export function updateClassroom(classroom) {
  return dispatch => {
    axios.put(serverUrl + 'classrooms/' + classroom._id, classroom).then(
      (res) => {
        dispatch(updateClassroomAction(res.data.classroom));
      })
  }
}

export function deleteClassroomAction(classroom) {
  return {
    type: DELETE_CLASSROOM,
    classroom: classroom
  }
}

export function deleteClassroom(classroom) {
  return dispatch => {
    axios.delete(serverUrl + "classrooms/" + classroom._id).then(
      (res) => {
        dispatch(deleteClassroomAction(classroom));
      });
  }
}