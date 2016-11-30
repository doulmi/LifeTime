import { LOAD_COURSE, ADD_COURSE, LOAD_COURSES, DELETE_COURSE, UPDATE_COURSE, START_LOAD_COURSES, LOAD_ALL_COURSES } from '../actions/types'

const initState = {
  courses: [],
  isLoading: false,
  course: {}
}

const courses = (state = initState, action) => {
  switch (action.type) {
    case START_LOAD_COURSES: return {
      courses: state.courses,
      isLoading: true,
      course: state.course
    }
    case LOAD_COURSE: return {
      courses: state.courses,
      isLoading: state.isLoading,
      course: action.course
    }

    case LOAD_COURSES: return {
      courses: action.courses,
      isLoading: false,
      course: state.course
    }

    case ADD_COURSE: return {
      courses: [...state.courses, action.course],
      isLoading: state.isLoading,
      course: state.course
    }

    case UPDATE_COURSE: {
      let i = 0;
      for (; i < state.courses.length; i++) {
        if (state.courses[i]._id == action.course._id) {
          break;
        }
      }

      return {
        courses: [...state.courses.slice(0, i), action.course, ...state.courses.slice(i + 1)],
        isLoading: state.isLoading,
        course: state.course
      }
    };

    case DELETE_COURSE: {
      let courses = state.courses.filter(course => {
        return course._id != action.course._id
      })
      return {
        courses: courses,
        isLoading: state.isLoading,
        course: state.course
      }
    }
    case LOAD_ALL_COURSES: {
      return {
        courses: action.courses,
        isLoading: false,
        course: state.course
      }
    }
    default: return state;
  }
}

export default courses 