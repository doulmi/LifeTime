import axios from 'axios'

import { START_LOAD_NOTIFICATIONS, LOAD_NOTIFICATIONS, DELETE_NOTIFICATION, ADD_NOTIFICATION, UPDATE_NOTIFICATION } from './types'
import {loadNumber, serverUrl } from '../constants'

export function startLoadNotificationsAction() {
  return {
    type: START_LOAD_NOTIFICATIONS
  }
}

export function loadNotificationsAction(notifications, paginate) {
  return {
    type: LOAD_NOTIFICATIONS,
    notifications: notifications,
    paginate: paginate
  }
}

export function loadNotifications(page, query = '', limit = loadNumber) {
  return dispatch => {
    dispatch(startLoadNotificationsAction());
    axios.get(serverUrl + 'notifications/' + limit + '/' + page + query).then(
      (res) => {
      let notifications = res.data.notifications;
      let total = res.data.total;
      let paginate = {
        total: total,
        limit: limit,
        currentPage: page,
        nextPage: page == total -1 ? undefined : page + 1,
        prePage : page == 0 ? undefined : page - 1
      }
      dispatch(loadNotificationsAction(notifications, paginate));
    });
  }
}

export function addNotificationAction(notification) {
  return {
    type: ADD_NOTIFICATION,
    notification: notification
  }
}

export function addNotification(notification) {
  return dispatch => {
    axios.post(serverUrl + 'notifications', notification).then(
      (res) => {
      dispatch(addNotificationAction(res.data.notification));
    })
  }
}

export function deleteNotificationAction(notification) {
  return {
    type: DELETE_NOTIFICATION,
    notification: notification
  }
}

export function deleteNotification(notification) {
  return dispatch => {
    axios.delete(serverUrl + "notifications/" + notification._id).then(
      (res) => {
      dispatch(deleteNotificationAction(notification));  
    });
  }
}

export function updateNotificationAction(notification) { 
  return {
    type: UPDATE_NOTIFICATION,
    notification: notification
  }
}

export function updateNotification(notification) {
  return dispatch => {
    axios.put(serverUrl + 'notifications/' + notification._id, notification).then(
      (res) => {
      dispatch(updateNotificationAction(res.data.notification));
    }) 
  }
}
