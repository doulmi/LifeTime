import axios from 'axios'

import { ADD_TEACHERS, START_LOAD_TEACHERS, LOAD_TEACHERS, ADD_TEACHER, UPDATE_TEACHER, DELETE_TEACHER } from './types'
import { teacherLoadNumber, serverUrl } from '../constants'

export function loadAllTeachers() {
  return dispatch => {
    let url = serverUrl + 'teachers/fetchAll';
    axios.get(url).then(
      (res) => {
        let teachers = res.data.teachers;
        let paginate = {}
        dispatch(loadTeachersAction(teachers, paginate));
      }
    )
  }
}

export function startLoadTeachersAction() {
  return {
    type: START_LOAD_TEACHERS
  }
}

export function loadTeachersAction(teachers, paginate) {
  return {
    type: LOAD_TEACHERS,
    teachers: teachers,
    paginate: paginate,
  }
}

export function loadTeachers(page, query = '', limit = teacherLoadNumber, ) {
  return dispatch => {
    dispatch(startLoadTeachersAction());
    let url = serverUrl + 'teachers/' + limit + '/' + page + query;
    axios.get(url).then(
      (res) => {
        let teachers = res.data.teachers;
        let total = res.data.total;
        let paginate = {
          total: total,
          limit: limit,
          currentPage: page,
          nextPage: page == total - 1 ? undefined : page + 1,
          prePage: page == 0 ? undefined : page - 1
        }
        dispatch(loadTeachersAction(teachers, paginate));
      });
  }
}


export function addTeacherAction(teacher) {
  return {
    type: ADD_TEACHER,
    teacher: teacher
  }
}

export function updateTeacherAction(teacher) {
  return {
    type: UPDATE_TEACHER,
    teacher: teacher
  }
}

export function deleteTeacherAction(teacher) {
  return {
    type: DELETE_TEACHER,
    teacher: teacher
  }
}

//import multi teachers
export function addTeachersAction(teachers) {
  return {
    type: ADD_TEACHERS,
    teachers: teachers
  }
}

export function permissionUpgrade(teacher) {
  return dispatch => {
    let url = serverUrl + 'teachers/upgrade/' + teacher._id;
    return axios.put(url).then(
      res => {
        dispatch(updateTeacherAction(res.data.user))
      }
    )
  }
}

export function permissionDowngrade(admin) {
  return dispatch => {
    let url = serverUrl + 'teachers/downgrade/' + admin._id;
    return axios.put(url).then(
      res => {
        dispatch(updateTeacherAction(res.data.user))
      }
    )
  }

}