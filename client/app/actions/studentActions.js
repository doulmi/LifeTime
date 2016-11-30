import axios from 'axios'

import { ADD_STUDENTS, START_LOAD_STUDENTS, LOAD_STUDENTS, ADD_STUDENT, UPDATE_STUDENT, DELETE_STUDENT } from './types'
import { studentLoadNumber, serverUrl } from '../constants'

export function loadStudentsByClass(classId) {
  return dispatch => {
    dispatch(startLoadStudentsAction());
    let url = serverUrl + 'students/class/' + classId;
    return axios.get(url).then(
      res => {
        dispatch(loadStudentsAction(res.data.students, {}));
      }
    )
  }
}

export function startLoadStudentsAction() {
  return {
    type: START_LOAD_STUDENTS
  }
}

export function loadStudentsAction(students, paginate) {
  return {
    type: LOAD_STUDENTS,
    students: students,
    paginate: paginate,
  }
}

export function loadStudents(page, query = '', limit = studentLoadNumber, ) {
  return dispatch => {
    dispatch(startLoadStudentsAction());
    let url = serverUrl + 'students/' + limit + '/' + page + query;
    axios.get(url).then(
      (res) => {
        let students = res.data.students;
        let total = res.data.total;
        let paginate = {
          total: total,
          limit: limit,
          currentPage: page,
          nextPage: page == total - 1 ? undefined : page + 1,
          prePage: page == 0 ? undefined : page - 1
        }
        dispatch(loadStudentsAction(students, paginate));
      });
  }
}


export function addStudentAction(student) {
  return {
    type: ADD_STUDENT,
    student: student
  }
}

export function updateStudentAction(student) {
  return {
    type: UPDATE_STUDENT,
    student: student
  }
}

export function deleteStudentAction(student) {
  return {
    type: DELETE_STUDENT,
    student: student
  }
}

//after import students
export function addStudents(students) {
  return {
    type: ADD_STUDENTS,
    students: students
  }
}