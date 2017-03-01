import { START_LOAD_EQUIPEMENTRECORDS, ADD_EQUIPEMENTRECORD, LOAD_EQUIPEMENTRECORDS, DELETE_EQUIPEMENTRECORD, UPDATE_EQUIPEMENTRECORD, LOAD_ALL_EQUIPEMENTRECORDS } from '../actions/types'

const initState = {
  equipementRecords: [],
  paginate: {},
  isLoading: false,
}
const equipementRecords = (state = initState, action) => {
  switch (action.type) {
    case START_LOAD_EQUIPEMENTRECORDS: return {
      equipementRecords: state.equipementRecords,
      paginate: state.paginate,
      isLoading: true,
    }
    case LOAD_EQUIPEMENTRECORDS: return {
      equipementRecords: [...action.equipementRecords],
      paginate: action.paginate,
      isLoading: false,
    }
    case ADD_EQUIPEMENTRECORD: return {
      equipementRecords: [action.equipementRecord, ...state.equipementRecords],
      paginate: action.paginate,
      isLoading: state.isLoading
    }
    case UPDATE_EQUIPEMENTRECORD: {
      let i = 0;
      for(; i < state.equipementRecords.length; i ++) {
        if(state.equipementRecords[i]._id == action.equipementRecord._id) {
          break;
        }
      }
      return {
        equipementRecords: [...state.equipementRecords.slice(0, i), action.equipementRecord, ...state.equipementRecords.slice(i + 1, state.equipementRecords.length)],
        paginate: action.paginate,
        isLoading: state.isLoading
      }
    }
    case DELETE_EQUIPEMENTRECORD: {
      let equipementRecords = state.equipementRecords.filter(equipementRecord => {
        return equipementRecord._id != action.equipementRecord._id
      })
      return {
        equipementRecords: equipementRecords,
        paginate: action.paginate,
        isLoading: state.isLoading
      }
    }
    default: return state;
  }
}

export default equipementRecords 