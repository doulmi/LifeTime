import { LOAD_CLASSES, START_LOAD_CLASSES, DELETE_CLASS, ADD_CLASS, UPDATE_CLASS } from '../actions/types'

const initState = {
  classes: [],
  isLoading: false
}

const classes = (state = initState, action) => {
  switch (action.type) {
    case LOAD_CLASSES: return {
      classes: action.classes,
      isLoading: false
    }

    case START_LOAD_CLASSES: return {
      classes: state.classes,
      isLoading: true
    }

    case DELETE_CLASS: {
      let classes = state.classes.filter(cls => {
        return cls._id != action.cls._id
      })
      return {
        classes: classes,
        isLoading: state.isLoading
      }
    }

    case ADD_CLASS: {
      return {
        classes: [action.cls, ...state.classes],
        isLoading: state.isLoading
      }
    }

    case UPDATE_CLASS: {
      let i = 0;
      for (; i < state.classes; i++) {
        if (action.cls._id == state.classes[i]._id) {
          break;
        }
      }
      
      return {
        classes: [...state.classes.slice(0, i), action.cls, ...state.classes.slice(i)],
        isLoading: state.isLoading
      }
    }
    default: return state;
  }
}

export default classes 