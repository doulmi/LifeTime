import axios from 'axios'

import { LOAD_ALL_COURSES, START_LOAD_COURSES, LOAD_COURSES, DELETE_COURSE, ADD_COURSE, UPDATE_COURSE, START_LOAD_COURSE, LOAD_COURSE } from './types'
import { courseLoadNumber, serverUrl } from '../constants'

export function loadTeacherCourses(teacher) {
  return dispatch => {
    let url = serverUrl + 'courses/teacher/' + teacher._id;
    return axios.get(url).then(
      res => {
        dispatch(loadAllCoursesAction(res.data.courses));
      }
    )
  }  
}

export function startLoadCoursesAction() {
  return {
    type: START_LOAD_COURSES,
    isLoading: true
  }
}

export function loadAllCoursesAction(courses) {
  return {
    type: LOAD_ALL_COURSES,
    courses: courses
  }
}

export function loadCourseAction(course){
  return {
    type: LOAD_COURSE,
    course: course
  }
}
export function loadCourseById(id) {
  return dispatch => {
    let url = serverUrl + 'courses/' + id;
    return axios.get(url).then(
      res => {
        dispatch(loadCourseAction(res.data.course));          
      }
    )
  } 
} 

export function loadAllCourses()  {
  return dispatch => {
    let url = serverUrl + 'courses/fetchAll'
    axios.get(url).then(
      res => {
        dispatch(loadAllCoursesAction(res.data.courses))
      }
    )
  }
}

export function loadCoursesAction(courses, paginate) {
  return {
    type: LOAD_COURSES,
    courses: courses,
    paginate: paginate,
    isLoading: false,
  }
}

export function loadCourses(page, query = '', limit = courseLoadNumber) {
  return dispatch => {
    dispatch(startLoadCoursesAction());
    let url = serverUrl + 'courses/' + limit + '/' + page + query;
    axios.get(url).then(
      (res) => {
        let courses = res.data.courses;
        let total = res.data.total;
        let paginate = {
          total: total,
          limit: limit,
          currentPage: page,
          nextPage: page == total - 1 ? undefined : page + 1,
          prePage: page == 0 ? undefined : page - 1
        }
        dispatch(loadCoursesAction(courses, paginate));
      });
  }
}

export function addCourseAction(course) {
  return {
    type: ADD_COURSE,
    course: course
  }
}

export function addCourse(course) {
  return dispatch => {
    let url = serverUrl + 'courses';
    axios.post(url, course).then(
      res => {
        dispatch(addCourseAction(res.data.course));
      }
    )
  }
}

export function updateCourseAction(course) {
  return {
    type: UPDATE_COURSE,
    course: course
  }
}

export function updateCourse(course) {
  return dispatch => {
    let url = serverUrl + 'courses/' + course._id;
    axios.put(url, course).then(
      res => {
        dispatch(updateCourseAction(course));
      }
    )
  }
}

export function deleteCourseAction(course) {
  return {
    type: DELETE_COURSE,
    course: course
  }
}
export function deleteCourse(course) {
  return dispatch => {
    let url = serverUrl + 'courses/' + course._id;
    axios.delete(url).then(
      res => {
        dispatch(deleteCourseAction(course));
      }
    )
  }
}