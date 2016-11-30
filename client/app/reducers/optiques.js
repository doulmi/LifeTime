import { START_LOAD_OPTIQUES, ADD_OPTIQUE, LOAD_OPTIQUES, DELETE_OPTIQUE, UPDATE_OPTIQUE, START_FETCH_OPTIQUES, FETCH_OPTIQUES } from '../actions/types'

const initState = {
  optiques: [],
  isLoading: false
}
const optiques = (state = initState, action) => {
  switch (action.type) {
    case START_FETCH_OPTIQUES: return {
      optiques: state.optiques,
      isLoading: true
    }
    case FETCH_OPTIQUES: return {
      optiques: action.optiques,
      isLoading: false
    }
    case START_LOAD_OPTIQUES: return {
      optiques: state.optiques,
      isLoading: true
    };
    case LOAD_OPTIQUES: return {
      optiques: action.optiques,
      isLoading: false
    }
    case ADD_OPTIQUE: return {
      optiques: [action.optique, ...state.optiques],
      isLoading: false
    }
    case UPDATE_OPTIQUE: return {
      optiques: action.optiques,
      isLoading: false
    }
    case DELETE_OPTIQUE: {
      const optiques = state.optiques.filter(optique => {
        return optique._id != action.optique._id
      })
      return {
        optiques: optiques,
        isLoading: false
      }
    }
    default: return state;
  }
}

export default optiques 