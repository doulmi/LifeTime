// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import jwt from 'jsonwebtoken';
import setAuthorizationToken from '../utils/setAuthorizationToken'
import { setCurrentUser } from '../actions/authActions'

const router = routerMiddleware(browserHistory);

const enhancer = applyMiddleware(thunk, router);

export default function configureStore(initialState: Object) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (localStorage.jwtToken) {
    let user = jwt.decode(localStorage.jwtToken);
    setAuthorizationToken(localStorage.jwtToken);
    store.dispatch(setCurrentUser(user));
  }
  return store
}
