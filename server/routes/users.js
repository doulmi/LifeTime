import express from 'express'
import bcrypt from 'bcryptjs'

import studentMiddleware from '../middlewares/studentMiddleware'
import adminMiddleware from '../middlewares/adminMiddleware'
import teacherMiddleware from '../middlewares/teacherMiddleware'
import Role from '../models/role'
import Class from '../models/class'
import User from '../models/user'
import { DEFAULT_PASSWORD } from '../share/constants'

const router = express.Router()

//添加新学生
router.post('/student', adminMiddleware, (req, res) => {
  Role.findOne({ slug: 'student' })
    .exec((err, role) => {
      let user = new User(req.body);
      Class.findOne({ _id: req.body.class }, (err, cls) => {
        user.password = bcrypt.hashSync(DEFAULT_PASSWORD, 10);
        user.role = role.id;
        user.grade = cls.grade;
        user.save(err => {
          user.class = cls;
          res.json({ user });
        })
      })
    });
});

//添加新老师
router.post('/teacher', adminMiddleware, (req, res) => {
  Role.findOne({ slug: 'teacher' })
    .exec((err, role) => {
      let user = new User(req.body);
      user.password = bcrypt.hashSync(DEFAULT_PASSWORD, 10);
      user.class = null;
      user.role = role.id;
      user.save(err => {
        if (err) throw err;
        res.json({ user });
      })
    });
});

//用户修改自身的信息：密码，地址，电话，出生日期
router.put('/updateInfo/:id', (req, res) => {
  let user = req.user;
  if (req.user._id != req.params.id) {
    res.json({ success: false })
  } else {
    user.address = req.body.address;
    user.phone = req.body.phone;
    user.birthday = req.body.birthday
    user.save(() => {
      res.json({ success: true })
    });
  }
})

router.put('/modifyPassword/:id', (req, res) => {
  let user = req.user;

  if (req.user._id != req.params.id) {
    res.status(301).json({ success: false })
  } else {
    if (bcrypt.compareSync(req.body.oldPassword, user.password)) {
      user.password = bcrypt.hashSync(req.body.password)
      user.save(() => {
        res.json({ success: true })
      });
    } else {
      res.stats(301).json({ success: false })
    }
  }
})

//更新
router.put('/:id', adminMiddleware, (req, res) => {
  User.findOne({ _id: req.body._id }).populate('role').exec((err, user) => {
    if (err) throw err;
    let data = req.body;
    user.name = data.name;
    user.sex = data.sex;
    user.birthday = data.birthday;
    user.address = data.address;
    user.userId = data.userId;
    user.room = data.room;
    user.phone = data.phone;

    if (user.role.slug == 'student') {
      Class.findOne({ _id: req.body.class }, (err, cls) => {
        if (err) throw err;
        user.class = data.class == '' ? null : data.class;
        user.grade = cls.grade;
        user.classes = data.classes;
        user.save((err) => {
          if(err) res.status(403).json({success: false})
          user.class = cls;
          res.json({ user })
        });
      })
    } else {
      user.classes = data.classes;
      user.save((err) => {
        res.json({ user })
      });
    }
  });
});

//取得用户信息
router.get('/:id', (req, res) => {
  User.findOne({ _id: req.params.id })
    .populate('role')
    .populate('class')
    .populate('classes')
    .exec((err, user) => {
      res.json({ user });
    })
})

router.delete('/:id', (req, res) => {
  User.findOne({ _id: req.params.id })
    .exec((err, user) => {
      if (err) throw err;
      user.isDeleted = true;
      user.save();
      res.json({ user });
    })

})

module.exports = router