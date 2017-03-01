import { START_LOAD_EQUIPEMENTS, ADD_EQUIPEMENT, LOAD_EQUIPEMENTS, DELETE_EQUIPEMENT, UPDATE_EQUIPEMENT, LOAD_ALL_EQUIPEMENTS } from '../actions/types'

const initState = {
  equipements: [],
  paginate: {},
  isLoading: false,
}
const equipements = (state = initState, action) => {
  switch (action.type) {
    case START_LOAD_EQUIPEMENTS: return {
      equipements: state.equipements,
      paginate: state.paginate,
      isLoading: true,
    }
    case LOAD_EQUIPEMENTS: return {
      equipements: [...action.equipements],
      paginate: action.paginate,
      isLoading: false,
    }
    case LOAD_ALL_EQUIPEMENTS: return {
      equipements: [...action.equipements],
      paginate: {},
      isLoading:  false   
    }
    case ADD_EQUIPEMENT: return {
      equipements: [action.equipement, ...state.equipements],
      paginate: action.paginate,
      isLoading: state.isLoading
    }
    case UPDATE_EQUIPEMENT: {
      let i = 0;
      for(; i < state.equipements.length; i ++) {
        if(state.equipements[i]._id == action.equipement._id) {
          break;
        }
      }
      return {
        equipements: [...state.equipements.slice(0, i), action.equipement, ...state.equipements.slice(i + 1, state.equipements.length)],
        paginate: action.paginate,
        isLoading: state.isLoading
      }
    }
    case DELETE_EQUIPEMENT: {
      let equipements = state.equipements.filter(equipement => {
        return equipement._id != action.equipement._id
      })
      return {
        equipements: equipements,
        paginate: action.paginate,
        isLoading: state.isLoading
      }
    }
    default: return state;
  }
}

export default equipements 