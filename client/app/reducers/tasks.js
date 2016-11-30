import { ADD_TASK, LOAD_TASKS, DELETE_TASK, LOAD_TASKS_DATE, START_FETCH_TASKS } from '../actions/types'

const initState = {
  tasks: [],
  noMore: false,
  analyse: [],
  isLoading: false
}

const tasks = (state = initState, action) => {
  switch (action.type) {
    case LOAD_TASKS: return {
      tasks: [...state.tasks, ...action.tasks],
      noMore: action.noMore,
      analyse: state.analyse,
      isLoading: false
    };

    case ADD_TASK: return {
      tasks: [action.task, ...state.tasks],
      noMore: state.noMore,
      analyse: state.analyse,
      isLoading: state.isLoading
    };

    case DELETE_TASK: {
      return {
        tasks: state.tasks.filter(task => {
          return task._id != action.task._id
        }),
        noMore: state.noMore,
        analyse: state.analyse,
        isLoading: state.isLoading
      }
    }

    case LOAD_TASKS_DATE: {
      return {
        tasks: state.tasks,
        noMore: state.noMore,
        analyse: action.tasks,
        isLoading: false
      }
    }
    
    case START_FETCH_TASKS: {
      return {
        tasks: state.tasks,
        noMore: state.noMore,
        analyse: state.tasks,
        isLoading: true 
      }
    }

    default: return state;
  }
}

export default tasks
