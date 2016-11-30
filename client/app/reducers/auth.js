import { SET_CURRENT_USER, UPDATE_CURRENT_USER } from '../actions/types'
import isEmpty from 'lodash/isEmpty'

const initialState = {
  isAuthenticated: false,
  user: {}
}

const auth = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        isAuthenticated: !isEmpty(action.user),
        user: action.user
      }
    case UPDATE_CURRENT_USER: 
      return {
        isAuthenticated: state.isAuthenticated,
        user: {
          _id: state.user._id,
          userId: state.user.userId,
          name: state.user.name,
          role: state.user.role,
          permissions: state.user.permissions,
          classes: state.user.classes,
          class: state.user.class,
          grade: state.user.grade,
          sex: state.user.sex,
          address: action.user.address,
          phone: action.user.phone,
          birthday: action.user.birthday
        }
      }

    default: return state;
  }
}

export default auth
