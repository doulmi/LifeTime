import { ADD_TAG, LOAD_TAGS, DELETE_TAG, UPDATE_TAG, START_LOAD_TAGS } from '../actions/types'

const initState = {
  tags: [],
  isLoading: false
}

const tags = (state = initState, action) => {
  switch (action.type) {
    case START_LOAD_TAGS: return {
      tags: state.tags,
      isLoading: true
    }
    
    case LOAD_TAGS: return {
      tags: [...action.tags],
      isLoading: false
    }
    
    case ADD_TAG: return {
      tags: [...state.tags, action.tag],
      isLoading: state.isLoading
    }
    
    case UPDATE_TAG: return {
      tags: action.tags,
      isLoading: state.isLoading
    };
    
    case DELETE_TAG: {
      let tags = state.tags.filter(tag => {
        return tag._id != action.tag._id
      })
      return {
        tags: tags,
        isLoading: state.isLoading
      }
    }
    default: return state;
  }
}

export default tags 