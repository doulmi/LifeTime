import axios from 'axios'

import { LOAD_TAGS, DELETE_TAG, ADD_TAG, UPDATE_TAG, START_LOAD_TAGS } from './types'
import { serverUrl } from '../constants'

export function startLoadTagsAction() {
  return {
    type: START_LOAD_TAGS,
  }
}

export function loadTagsAction(tags) {
  return {
    type: LOAD_TAGS,
    tags: tags
  }
}

export function loadTags() {
  return dispatch => {
    axios.get(serverUrl + 'tags').then(
      (res) => {
        let tags = res.data.tags;
        dispatch(loadTagsAction(tags));
      });
  }
}

export function addTagAction(tag) {
  return {
    type: ADD_TAG,
    tag: tag
  }
}

export function addTag(tag) {
  return dispatch => {
    return axios.post(serverUrl + 'tags', tag).then(
      (res) => {
        dispatch(addTagAction(res.data.tag));
      })
  }
}

export function updateTagAction(tags) {
  return {
    type: UPDATE_TAG,
    tags: tags
  }
}

export function updateTag(tag) {
  return dispatch => {
    return axios.put(serverUrl + 'tags/' + tag.id, tag).then(
      (res) => {
        dispatch(updateTagAction(res.data.tags));
      })
  }
}


export function deleteTagAction(tag) {
  return {
    type: DELETE_TAG,
    tag: tag
  }
}

export function deleteTag(tag) {
  return dispatch => {
    return axios.delete(serverUrl + "tags/" + tag._id).then(
      (res) => {
        dispatch(deleteTagAction(tag));
      });
  }
}