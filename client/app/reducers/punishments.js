import { START_LOAD_PUNISHMENTS, ADD_PUNISHMENT, LOAD_PUNISHMENTS, DELETE_PUNISHMENT, UPDATE_PUNISHMENT } from '../actions/types'

const initState = {
  punishments: [],
  paginate: {},
  isLoading: false,
}
const punishments = (state = initState, action) => {
  switch (action.type) {
    case START_LOAD_PUNISHMENTS: return {
      punishments: state.punishments,
      paginate: state.paginate,
      isLoading: true,
    }
    case LOAD_PUNISHMENTS: return {
      punishments: [...action.punishments],
      paginate: action.paginate,
      isLoading: false,
    };
    // case ADD_PUNISHMENT: return {
    //   punishments: [action.punishment, ...state],
    //   paginate: state.paginate,
    //   isLoading: false,
    // };
    case UPDATE_PUNISHMENT: {
      let i = 0;
      for(; i < state.punishments.length; i ++) {
        if(state.punishments[i]._id == action.punishment._id) {
          break;
        }
      }
      return {
        punishments: [...state.punishments.slice(0, i), action.punishment, ...state.punishments.slice(i + 1, state.punishments.length)],
        paginate: action.paginate,
        isLoading: state.isLoading
      }
    };
    case DELETE_PUNISHMENT: {
      let punishments = state.punishments.filter(punishment => {
        return punishment._id != action.punishment._id
      })
      return {
        punishments: punishments,
        paginate: action.paginate,
        isLoading: state.isLoading
      }
    }
    default: return state;
  }
}

export default punishments 