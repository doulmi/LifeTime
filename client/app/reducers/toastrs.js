import { ADD_TOASTR, LOAD_TOASTRS, DELETE_TOASTR, UPDATE_TOASTR } from '../actions/types'

const toastrs = (state = [], action) => {
  switch (action.type) {
    case LOAD_TOASTRS: return state;
    case ADD_TOASTR: return [action.toastr];
    case DELETE_TOASTR: return [];
    default: return state;
  }
}

export default toastrs 