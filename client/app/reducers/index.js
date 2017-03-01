// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import auth from './auth'
import tasks from './tasks'
import tags from './tags'
import moods from './moods'
import achievements from './achievements'
import punishments from './punishments'
import optiques from './optiques'
import notifications from './notifications'
import students from './students'
import teachers from './teachers'
import toastrs from './toastrs'
import classes from './classes'
import collects from './collects'
import users from './users'
import courses from './courses'
import scheduals from './scheduals'
import scores from './scores'
import checks from './checks'
import classrooms from './classrooms'
import equipements from './equipements'
import equipementRecords from './equipementRecords'

const rootReducer = combineReducers({
  routing,
  auth,
  tasks,
  tags,
  moods,
  achievements,
  punishments,
  optiques,
  notifications,
  toastrs,
  students,
  teachers,
  classes,
  collects,
  users,
  courses,
  scheduals,
  scores,
  checks,
  classrooms,
  equipements,
  equipementRecords
});

export default rootReducer;
