import { ADD_MOOD, LOAD_MOODS, DELETE_MOOD, START_LOAD_MOODS, FETCH_MOODS, START_FETCH_MOODS } from '../actions/types'

const initialState = {
  moods: [],
  noMore: false,
  isLoading: false
};

const moods = (state = initialState, action) => {
  switch (action.type) {
    case START_FETCH_MOODS: return {
      moods: state.moods,
      noMore: state.noMore,
      isLoading: true
    }
    case FETCH_MOODS: return {
      moods: action.moods,
      noMore: state.noMore,
      isLoading: false
    }
    case START_LOAD_MOODS: return {
      moods: state.moods,
      noMore: action.noMore,
      isLoading: true,
    }
    case LOAD_MOODS: return {
      moods: [...state.moods, ...action.moods],
      noMore: action.noMore,
      isLoading: false, 
    };
    case ADD_MOOD: return {
      moods: [action.mood, ...state.moods],
      noMore: state.noMore,
      isLoading : state.isLoading
    };
    case DELETE_MOOD: {
      return {
        moods: state.moods.filter(mood => {
          return mood._id != action.mood._id
        }),
        noMore: state.noMore,
        isLoading: state.isLoading
      }
    }
    default: return state;
  }
}

export default moods 