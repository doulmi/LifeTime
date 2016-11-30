import { ADD_TEACHERS, UPDATE_TEACHER, DELETE_TEACHER, ADD_TEACHER, LOAD_TEACHERS, START_LOAD_TEACHERS } from '../actions/types'

const initState = {
  teachers: [],
  paginate: {},
  isLoading: false
}

const teachers = (state = initState, action) => {
  switch (action.type) {
    case START_LOAD_TEACHERS: return {
      teachers: state.teachers,
      paginate: state.paginate,
      isLoading: true
    }
    case LOAD_TEACHERS: return {
      teachers: [...action.teachers],
      paginate: action.paginate,
      isLoading: false
    };
    case UPDATE_TEACHER: {
      let i = 0;
      for (; i < state.teachers.length; i++) {
        if (state.teachers[i]._id == action.teacher._id) {
          break;
        }
      }
      return {
        teachers: [...state.teachers.slice(0, i), action.teacher, ...state.teachers.slice(i + 1)],
        paginate: state.paginate,
        isLoading: state.isLoading
      }
    };
    case ADD_TEACHER: return {
      teachers: [action.teacher, ...state.teachers],
      paginate: state.paginate,
      isLoading: state.isLoading
    };
    case ADD_TEACHERS: return {
      teachers: [...action.teachers, ...state.teachers],
      paginate: state.paginate,
      isLoading: state.isLoading
    }
    case DELETE_TEACHER: {
      let teachers = state.teachers.filter(teacher => {
        return teacher._id != action.teacher._id;
      });

      return {
        teachers: teachers,
        paginate: state.paginate,
        isLoading: state.isLoading
      }
    }
    default: return state;
  }
}

export default teachers 