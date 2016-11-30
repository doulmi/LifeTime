import { ADD_TOASTR, LOAD_TOASTRS, DELETE_TOASTR } from './types'

export function addToastr(toastr) {
  return {
    type: ADD_TOASTR,
    toastr: toastr
  }
}

export function loadToastr(toastrs) {
  return {
    type: LOAD_TOASTRS,
    toastrs: toastrs,
  }
}

export function deleteToastr(toastr) {
  return {
    type: DELETE_TOASTR,
    toastr: toastr
  }
}