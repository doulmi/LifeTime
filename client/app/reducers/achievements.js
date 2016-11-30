import { START_LOAD_ACHIEVEMENTS, ADD_ACHIEVEMENT, LOAD_ACHIEVEMENTS, DELETE_ACHIEVEMENT, UPDATE_ACHIEVEMENT } from '../actions/types'

const initState = {
  achievements: [],
  paginate: {},
  isLoading: false,
}
const achievements = (state = initState, action) => {
  switch (action.type) {
    case START_LOAD_ACHIEVEMENTS: return {
      achievements: state.achievements,
      paginate: state.paginate,
      isLoading: true,
    }
    case LOAD_ACHIEVEMENTS: return {
      achievements: [...action.achievements],
      paginate: action.paginate,
      isLoading: false,
    };
    case UPDATE_ACHIEVEMENT: {
      let i = 0;
      for(; i < state.achievements.length; i ++) {
        if(state.achievements[i]._id == action.achievement._id) {
          break;
        }
      }
      return {
        achievements: [...state.achievements.slice(0, i), action.achievement, ...state.achievements.slice(i + 1, state.achievements.length)],
        paginate: action.paginate,
        isLoading: state.isLoading
      }
    };
    case DELETE_ACHIEVEMENT: {
      let achievements = state.achievements.filter(achievement => {
        return achievement._id != action.achievement._id
      })
      return {
        achievements: achievements,
        paginate: action.paginate,
        isLoading: state.isLoading
      }
    }
    default: return state;
  }
}

export default achievements 