import { LOAD_USER, START_LOAD_USER, ADD_USER_CALLBACK } from '../actions/types'

const initState = {
  user: {},
  isLoading: false,
  success: false
}

const users = (state = initState, action) => {
  switch (action.type) {
    case START_LOAD_USER: return {
      user: state.user,
      isLoading: true,
      success: state.success
    }
    case LOAD_USER:
      return {
        user: action.user,
        isLoading: false,
        success: state.success
      };
    case ADD_USER_CALLBACK: {
      return {
        user: state.user,
        isLoading: state.isLoading,
        success: action.success
      }
    }
    default: return state;
  }
}

export default users 