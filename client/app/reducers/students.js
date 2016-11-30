import { ADD_STUDENTS, UPDATE_STUDENT, DELETE_STUDENT, ADD_STUDENT, LOAD_STUDENTS, START_LOAD_STUDENTS } from '../actions/types'

const initState = {
  students: [],
  paginate: {},
  isLoading: false
}

const students = (state = initState, action) => {
  switch (action.type) {
    case START_LOAD_STUDENTS : return {
      students: state.students,
      paginate: state.paginate,
      isLoading: true
    }
    case LOAD_STUDENTS: return {
      students: [...action.students],
      paginate: action.paginate,
      isLoading: false
    };
    case UPDATE_STUDENT: {
      let i = 0;
      for(; i < state.students.length; i ++) {
        if(state.students[i]._id == action.student._id) {
          break;
        }
      }
      return {
        students: [...state.students.slice(0, i), action.student, ...state.students.slice(i+1)],
        paginate: state.paginate,
        isLoading: state.isLoading
      }
    };
    case ADD_STUDENT: return {
      students: [action.student, ...state.students],
      paginate: state.paginate,
      isLoading: state.isLoading
    };
    case ADD_STUDENTS: return {
      students: [...actions.students, ...state.students],
      paginate: state.paginate,
      isLoading: state.isLoading
    }
    case DELETE_STUDENT: {
      let students = state.students.filter(student => {
        return student._id != action.student._id;
      }); 

      return {
        students: students,
        paginate: state.paginate,
        isLoading: state.isLoading
      }
    }
    default: return state;
  }
}

export default students 