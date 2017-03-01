import N18 from '../constants/string'
import validator from 'validator'
import { isEmpty } from 'lodash'

export function validTag(data) {
  let errors = {};

  if (validator.isEmpty(data.name)) {
    errors.name = N18.tagnameIsRequired;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

/**
 * 判断输入的任务信息是否正确
 */
export function validateTask(data) {
  let errors = {};
  if (!(data.start instanceof Date)) {
    errors.startError = N18.startFieldShouldBeDate;
  }

  if (!(data.stop instanceof Date)) {
    errors.stopError = N18.stopFieldShouldBeDate;
  }

  if (data.stop instanceof Date && data.start instanceof Date) {
    let start = new Date(data.start);
    let stop = new Date(data.stop);

    if (stop < start) {
      errors.stopError = N18.endShouldAfterStart
    }
  }
  
  if (validator.isEmpty(data.taskname)) {
    errors.tasknameErr = N18.taskNameIsRequired
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

/**
 * 判断输入的学生信息是否正常
 */
export function validateStudent(data) {
  let errors = {};

  let isValid = true;
  if (data.name == '') {
    errors.name = N18.nameIsRequired;
  }

  if (!(data.birthday instanceof Date)) {
    errors.birthday = N18.birthdayShouldBeDate
  }
  if (data.class == '') {
    errors.classs = N18.classIsRequired;
  }

  if (data.userId == '') {
    errors.userId = N18.userIdIsRequired;
  }
  return {
    errors,
    isValid: isEmpty(errors)
  }
}

/**
 * 判断老师信息是否正常
 */
export function validateTeacher(data) {
  let errors = {};

  let isValid = true;
  if (data.name == '') {
    errors.name = N18.nameIsRequired;
    isValid = false;
  }

  if (!(data.birthday instanceof Date)) {
    errors.birthday = N18.birthdayShouldBeDate
    isValid = false;
  }
  if (!(data.classes instanceof Array)) {
    errors.classses = N18.classIsRequired;
    isValid = false;
  }

  if (data.userId == '') {
    errors.userId = N18.userIdIsRequired;
    isValid = false;
  }
  return {
    errors,
    isValid
  };
}

/**
 * 判断登录时输入信息是否正常
 */
export const validLoginData = (data) => {
  let errors = {};

  if (validator.isEmpty(data.userId)) {
    errors.userId = N18.useridIsRequired;
  }

  if (validator.isEmpty(data.password)) {
    errors.password = N18.passwordIsRequired;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

/**
 * 判断课程信息输入是否正常
 */
export const validCourseData = (data) => {
  let errors = {};

  if (validator.isEmpty(data.teacher)) {
    errors.teacher = N18.teacherIsRequired;
  }

  if (validator.isEmpty(data.name)) {
    errors.name = N18.courseNameIsRequired;
  }

  if (!validator.isInt('' + data.hours)) {
    errors.hours = N18.hoursMustBeNumber;
  }

  if (!validator.isFloat('' + data.credits)) {
    errors.credits = N18.creditsMustBeNumber;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

/**
 * 判断班级信息输入是否正常
 */
export const validClassData = (data) => {
  let errors = {};

  if (validator.isEmpty(data.name)) {
    errors.name = N18.classNameIsRequired;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

/**
 * 判断公告的输入是否正常
 */
export const validNotificationData = (data) => {
  let errors = {};

  if (validator.isEmpty(data.title))
    return {
      errors,
      isValid: isEmpty(errors)
    }
}

/**
 * 判断成就的输入是否正确
 */
export const validAchievementData = (data) => {
  let errors = {};

  if (!(data.happenAt instanceof Date)) {
    errors.happenAt = N18.happenAtIsRequired;
  }

  if (validator.isEmpty(data.title)) {
    errors.title = N18.achievementTitleIsRequired;
  }

  if (validator.isEmpty(data.content)) {
    errors.content = N18.achievementContentIsRequired;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

/**
 * 判断惩罚的输入是否正常
 */
export const validPunishmentData = (data) => {
  let errors = {};

  if (!(data.happenAt instanceof Date)) {
    errors.happenAt = N18.happenAtIsRequired;
  }

  if (validator.isEmpty(data.title)) {
    errors.title = N18.punishmentTitleIsRequired;
  }

  if (validator.isEmpty(data.content)) {
    errors.content = N18.punishmentContentIsRequired;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

/**
 * 判断名单的输入是否正常
 */
export const validCollectData = (data) => {
  let errors = {};

  if (validator.isEmpty(data.title)) {
    errors.title = N18.collectTitleIsRequired;
  }

  if (validator.isEmpty(data.content)) {
    errors.content = N18.collectContentIsRequired;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

/**
 * 判断教室的输入是否正常
 */
export const validateClassroomData = (data) => {
  let errors = {};

  if (validator.isEmpty(data.name)) {
    errors.name= N18.classroomNameIsRequired;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

/**
 * 判断用户修改密码时的输入是否正常
 */
export const validModifyPassword = (data) => {
  let errors = {};

  if (validator.isEmpty(data.password)) {
    errors.password = N18.passwordIsRequired;
  }

  if (validator.isEmpty(data.oldPassword)) {
    errors.oldPassword = N18.passwordIsRequired;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

/**
 * 判断用户修改个人信息的输入是否正确
 */
export const validUserInfoData = (data) => {
  let errors = {};

  if (!(data.birthday instanceof Date)) {
    errors.birthday = N18.birthdayShouldBeDate;
  }

  if (validator.isEmpty(data.phone)) {
    errors.phone = N18.phoneIsRequired;
  }

  if (validator.isEmpty(data.address)) {
    errors.address = N18.addressIsRequired;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

/**
 * 判断身心健康的输入是否正确
 */
export const validMoodData = (data) => {
  let errors = {};

  if (validator.isEmpty(data.text)) {
    errors.text = N18.moodTextIsRequired
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

/**
 * 判断视力的输入是否正确
 */
export const validOptiqueData = (data) => {
  let errors = {};

  if (!(validator.isInt('' + data.left) || validator.isFloat('' + data.left))) {
    errors.left = N18.leftOptiqueMustBeNumber
  }

  if (!(validator.isInt('' + data.right) || validator.isFloat('' + data.right))) {
    errors.right = N18.rightOptiqueMustBeNumber
  }
  console.log(data, errors);

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

/**
 * 判断课程表的输入是否正确
 */
export const validSchedualData = (data) => {
  let errors = {};

  if (validator.isEmpty(data.course)) {
    errors.course = N18.courseNameIsRequired
  }
  return {
    errors,
    isValid: isEmpty(errors)
  }
}

export const validateCollectData = (data) => {
  let errors = {};
  if (validator.isEmpty(data.title)) {
    errors.title = N18.collectTitleIsRequired
  }

  if (validator.isEmpty(data.title)) {
    errors.content= N18.collectContentIsRequired
  }
  
  return {
    errors,
    isValid: isEmpty(errors)
  }

}

function isInteger(n) {
  return Number(n) === n && n % 1 === 0
}

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}