import { ADD_STUDENT_TO_COLLECT, LOAD_NOT_SUBMIT_COLLECTS, LOAD_COLLECT, START_LOAD_COLLECT, START_LOAD_COLLECTS, ADD_COLLECT, LOAD_COLLECTS, DELETE_COLLECT, UPDATE_COLLECT, DELETE_STDEUNT_FROM_COLLECT } from '../actions/types'

const initState = {
  collects: [],
  paginate: {},
  isLoading: false,
  collect: {}
}

const collects = (state = initState, action) => {
  switch (action.type) {
    case ADD_COLLECT: return {
      collects: [action.collect, ...state.collects],
      paginage: state.paginate,
      collect: state.collect,
      isLoading: state.isLoading
    }
    case START_LOAD_COLLECTS: return {
      collects: state.collects,
      paginate: state.paginate,
      collect: state.collect,
      isLoading: true,
    }
    case LOAD_COLLECTS: return {
      collects: [...action.collects],
      paginate: action.paginate,
      collect: state.collect,
      isLoading: false,
    };
    case UPDATE_COLLECT: {
      let i = 0;
      for (; i < state.collects.length; i++) {
        if (state.collects[i]._id == action.collect._id) {
          break;
        }
      }
      return {
        collects: [...state.collects.slice(0, i), action.collect, ...state.collects.slice(i + 1, state.collects.length)],
        paginate: action.paginate,
        collect: state.collect,
        isLoading: state.isLoading
      }
    }
    case DELETE_COLLECT: {
      let collects = state.collects.filter(collect => {
        return collect._id != action.collect._id
      })
      return {
        collects: collects,
        paginate: action.paginate,
        collect: state.collect,
        isLoading: state.isLoading
      }
    }
    case START_LOAD_COLLECT: {
      return {
        collects: state.collects,
        paginate: state.paginate,
        collect: state.collect,
        isLoading: true
      }
    }
    case LOAD_COLLECT: {
      return {
        collects: state.collects,
        collect: action.collect,
        paginage: state.paginate,
        isLoading: false
      }
    }
    case LOAD_NOT_SUBMIT_COLLECTS: {
      return {
        collects: action.collects,
        collect: state.collect,
        paginage: state.paginate,
        isLoading: state.isLoading
      }
    }
    case DELETE_STDEUNT_FROM_COLLECT: {
      let i = 0;
      for (; state.collects.length; i++) {
        if (state.collects[i]._id == action.collectId) break;
      }

      if (i < state.collects.length) {
        let findedCollect = state.collects[i];
        let students = findedCollect.students.filter(student => {
          return student._id != action.studentId
        });
        findedCollect.students = students;
        return {
          collects: [...state.collects.slice(0, i), findedCollect, ...state.collects.slice(i + 1, state.collects.length)],
          paginage: state.paginate,
          collect: state.collect,
          isLoading: state.isLoading
        }
      } else {
        return state;
      }
    }
    default: return state;
  }
}

export default collects 