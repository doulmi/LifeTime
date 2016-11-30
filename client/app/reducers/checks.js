import { LOAD_STUDENTS_CHECKS, ADD_CHECK, LOAD_CHECKS, DELETE_CHECK, UPDATE_CHECK, START_LOAD_CHECKS, LOAD_ALL_CHECKS } from '../actions/types'

const initState = {
  checks: [],
  isLoading: false,
  studentChecks: {}
}

const checks = (state = initState, action) => {
  switch (action.type) {
    case LOAD_STUDENTS_CHECKS: return {
      checks: state.checks,
      isLoading: state.isLoading,
      studentChecks: action.studentChecks  
    }
    
    case START_LOAD_CHECKS: return {
      checks: state.checks,
      isLoading: true,
      studentChecks: state.studentChecks
    }

    case LOAD_CHECKS: return {
      checks: action.checks,
      isLoading: false,
      studentChecks: state.studentChecks
    }

    case ADD_CHECK: return {
      checks: [...state.checks, action.check],
      isLoading: state.isLoading,
      studentChecks: state.studentChecks
    }

    case UPDATE_CHECK: {
      let i = 0;
      for (; i < state.checks.length; i++) {
        if (state.checks[i]._id == action.check._id) {
          break;
        }
      }

      return {
        checks: [...state.checks.slice(0, i), action.check, ...state.checks.slice(i + 1)],
        isLoading: state.isLoading,
      studentChecks: state.studentChecks
      }
    };

    case DELETE_CHECK: {
      let checks = state.checks.filter(check => {
        return check._id != action.check._id
      })
      return {
        checks: checks,
        isLoading: state.isLoading,
      studentChecks: state.studentChecks
      }
    }
    case LOAD_ALL_CHECKS: {
      return {
        checks: action.checks,
        isLoading: false,
      studentChecks: state.studentChecks
      }
    }
    default: return state;
  }
}

export default checks 