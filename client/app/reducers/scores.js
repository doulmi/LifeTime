import { ADD_SCORE, LOAD_SCORES, DELETE_SCORE, UPDATE_SCORE, START_LOAD_SCORES, LOAD_ALL_SCORES } from '../actions/types'

const initState = {
  scores: [],
  isLoading: false
}

const scores = (state = initState, action) => {
  switch (action.type) {
    case START_LOAD_SCORES: return {
      scores: state.scores,
      isLoading: true
    }

    case LOAD_SCORES: return {
      scores: action.scores,
      isLoading: false
    }

    case ADD_SCORE: return {
      scores: [...state.scores, action.score],
      isLoading: state.isLoading
    }

    case UPDATE_SCORE: {
      let i = 0;
      for (; i < state.scores.length; i++) {
        if (state.scores[i]._id == action.score._id) {
          break;
        }
      }

      return {
        scores: [...state.scores.slice(0, i), action.score, ...state.scores.slice(i + 1)],
        isLoading: state.isLoading
      }
    };

    case DELETE_SCORE: {
      let scores = state.scores.filter(score => {
        return score._id != action.score._id
      })
      return {
        scores: scores,
        isLoading: state.isLoading
      }
    }
    case LOAD_ALL_SCORES: {
      return {
        scores: action.scores,
        isLoading: false
      }
    }
    default: return state;
  }
}

export default scores 