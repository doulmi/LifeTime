import { START_LOAD_NOTIFICATIONS, ADD_NOTIFICATION, LOAD_NOTIFICATIONS, DELETE_NOTIFICATION, UPDATE_NOTIFICATION } from '../actions/types'

const initState = {
  notifications: [],
  paginate: {},
  isLoading: false
}

const notifications = (state = [], action) => {
  switch (action.type) {
    case START_LOAD_NOTIFICATIONS: return {
      notifications: state.notifications,
      paginate: state.paginate,
      isLoading: true
    }
    case LOAD_NOTIFICATIONS: return {
      notifications: action.notifications,
      paginate: action.paginate,
      isLoading: false
    }
    case ADD_NOTIFICATION: return {
      notifications: [action.notification, ...state.notifications],
      paginate: state.paginate,
      isLoading: state.isLoading
    }
    case UPDATE_NOTIFICATION: {
      let i = 0;
      for(; i < state.notifications.length; i ++) {
        if(state.notifications[i]._id == action.notification._id) {
          break;
        }
      }
      return {
        notifications: [...state.notifications.slice(0, i), action.notification, ...state.notifications.slice(i + 1)],
        paginate: action.paginate,
        isLoading: state.isLoading
      }
    }
    case DELETE_NOTIFICATION: {
      let notifications = state.notifications.filter(notification => {
        return notification._id != action.notification._id
      })
      return {
        notifications: notifications,
        paginate: state.paginate,
        isLoading: state.isLoading
      }
    }
    default: return state;
  }
}

export default notifications 