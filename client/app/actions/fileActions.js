import { IMPORT_FILE, EXPORT_FILE } from './types'
import axios from 'axios'
import $ from 'jquery'

import { serverUrl } from '../constants'
import { addTeachersAction } from './teacherActions'
import { addStudentsAction } from './studentActions'

export function importFile(data, router, type = 'student') {
  return dispatch => {
    let url = serverUrl + 'files/uploadStudents';

    if (type == 'teacher') {
      url = serverUrl + 'files/uploadTeachers';
    }

    let fd = new FormData();
    fd.append('file', data, data.name);
    let token = localStorage.jwtToken;

    $.ajax({
      url: url,
      data: fd,
      processData: false,
      contentType: false,
      headers: {
        "Authorization": `Bearer ${token}`
      },
      type: 'POST',
      success: function (data) {
        if (data.success) {
          if (type == 'student') {
            router.push('/manageStudent');
          } else {
            router.push('manageTeacher')
          }
        }
      }
    });
  }
}

export function exportFile() {
  return dispatch => {
    let url = serverUrl + 'files/archiveStudents'
    axios.get(url).then(
      res => { }
    );
  }
}
