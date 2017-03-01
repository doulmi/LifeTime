import { START_LOAD_CLASSROOMS, ADD_CLASSROOM, LOAD_CLASSROOMS, DELETE_CLASSROOM, UPDATE_CLASSROOM } from '../actions/types'

const initState = {
  classrooms: [],
  paginate: {},
  isLoading: false,
}
const classrooms = (state = initState, action) => {
  switch (action.type) {
    case START_LOAD_CLASSROOMS: return {
      classrooms: state.classrooms,
      paginate: state.paginate,
      isLoading: true,
    }
    case LOAD_CLASSROOMS: return {
      classrooms: [...action.classrooms],
      paginate: action.paginate,
      isLoading: false,
    }
    case UPDATE_CLASSROOM: {
      let i = 0;
      for(; i < state.classrooms.length; i ++) {
        if(state.classrooms[i]._id == action.classroom._id) {
          break;
        }
      }
      return {
        classrooms: [...state.classrooms.slice(0, i), action.classroom, ...state.classrooms.slice(i + 1, state.classrooms.length)],
        paginate: action.paginate,
        isLoading: state.isLoading
      }
    }
    case DELETE_CLASSROOM: {
      let classrooms = state.classrooms.filter(classroom => {
        return classroom._id != action.classroom._id
      })
      return {
        classrooms: classrooms,
        paginate: action.paginate,
        isLoading: state.isLoading
      }
    }
    default: return state;
  }
}

export default classrooms 