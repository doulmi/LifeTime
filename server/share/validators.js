import validator from 'validator'
import {isEmpty} from 'lodash'

export const validLoginData = (data) => {
  let errors = {};

  validator.isEmpty('');
  if(validator.isEmpty(data.userId)) {
    errors.userId = '账号是必填项';
  }

  if(validator.isEmpty(data.password)) {
    errors.password = '密码是必填项';
  }

  return {
    errors,
    isValid : isEmpty(errors)
  }
}