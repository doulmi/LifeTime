import axios from 'axios'

import setAuthorizationToken from '../utils/setAuthorizationToken'
import jwt from 'jsonwebtoken'
import { SET_CURRENT_USER, UPDATE_CURRENT_USER } from './types'

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user: user
  }
}

export function updateCurrentUser(user) {
  return {
    type: UPDATE_CURRENT_USER,
    user: user
  }
}

export function loginRequest(data) {
  return (dispatch) => {
    return axios.post('http://localhost:3333/api/auth/', data).then(
      (res) => {
      const token = res.data.token;
      localStorage.setItem('jwtToken', token);
      setAuthorizationToken(token);
      dispatch(setCurrentUser(jwt.decode(token)));
    });
  }
}

export function logoutRequest() {
  return (dispatch) => {
    localStorage.removeItem('jwtToken');
    setAuthorizationToken(null);
    dispatch(setCurrentUser({}));
  }
}