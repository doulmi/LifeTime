import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { validLoginData } from '../share/validators'
import User from '../models/user'
import Role from '../models/role'
import Class from '../models/class'
import config from '../config'

const router = express.Router();

//login
router.post('/', function (req, res) {
  const {errors, isValid} = validLoginData(req.body);

  if (!isValid) {
    res.status(400).json({ errors });
  } else {
    const {userId, password} = req.body;

    User.findOne({ userId: userId })
      .populate('classes')
      .populate('role')
      .populate('class')
      .exec((err, user) => {
        if (err) { throw err; }
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            let params = {
              _id: user.id,
              userId: user.userId,
              name: user.name,
              role: user.role.slug,
              permissions: user.role.permissions,
              classes: user.classes,
              address: user.address,
              phone: user.phone,
              sex: user.sex,
              grade: user.grade,
              birthday: user.birthday,
              room: user.room,
              class: user.class,
            };

            if (user.role.slug == 'admin') {
              Class.find({}, (err, classes) => {
                params.classes = classes;

                const token = jwt.sign(params, config.jwtSecret);
                res.json({ token });
              })
            } else {

              const token = jwt.sign(params, config.jwtSecret);
              res.json({ token });
            }

          } else {
            errors.password = "密码不正确";
            res.status(401).json({ errors });
          }
        } else {
          errors.userId = "该用户不存在";
          res.status(401).json({ errors });
        }
      })
  }
});

module.exports = router;
