import { LOAD_SCHEDUAL, START_LOAD_SCHEDUALS, ADD_SCHEDUAL, LOAD_SCHEDUALS, DELETE_SCHEDUAL, UPDATE_SCHEDUAL } from '../actions/types'

const initState = {
  scheduals: [],
  schedual: {},
  isLoading: false
}

const scheduals = (state = initState, action) => {
  switch (action.type) {
    case START_LOAD_SCHEDUALS: return {
      scheduals: state.scheduals,
      schedual: state.schedual,
      isLoading: true
    }

    case LOAD_SCHEDUAL: return {
      scheduals: state.scheduals,
      schedual: action.schedual,
      isLoading: state.isLoading
    }
    case LOAD_SCHEDUALS: return {
      scheduals: action.scheduals,
      schedual: state.schedual,
      isLoading: false
    }
    case ADD_SCHEDUAL: return {
      scheduals: [action.schedual, ...state.scheduals],
      schedual: state.schedual,
      isLoading: state.isLoading
    }
    case UPDATE_SCHEDUAL: {
      let i = 0;
      for (; i < state.scheduals.length; i++) {
        if (state.scheduals[i]._id == action.schedual._id) {
          break;
        }
      }
      return {
        scheduals: [...state.scheduals.slice(0, i), action.schedual, ...state.scheduals.slice(i + 1)],
        schedual: state.schedual,
        isLoading: state.isLoading
      }
    }
    case DELETE_SCHEDUAL: {
      let scheduals = state.scheduals.filter(schedual => {
        return schedual._id != action.schedual._id
      })
      return {
        scheduals: scheduals,
        schedual: state.schedual,
        isLoading: state.isLoading
      }
    }
    default: return state;
  }
}

export default scheduals 