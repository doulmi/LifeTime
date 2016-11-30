import express from 'express'
import adminMiddleware from '../middlewares/adminMiddleware'
import Class from '../models/class'
import User from '../models/user'

const router = express.Router()

//取得所有classes
router.get('/', adminMiddleware, function (req, res) {
  let user = req.user;
  let condition = {};

  let grade = req.query.grade;
  if (grade != undefined) {
    condition['grade'] = grade;
  }

  let search = req.query.search;
  if (search != undefined) {
    condition['name'] = { '$regex': '.*' + search + '.*' }
  }

  Class.find(condition)
    .sort('grade')
    .exec((err, classes) => {
      if (err) throw err;
      res.json({ classes });
    });
});

//添加class
router.post('/', adminMiddleware, function (req, res) {
  let user = req.user;
  let classs = new Class({
    name: req.body.name,
    grade: req.body.grade
  })
  classs.save((err) => {
    if (err) throw err;
    res.json({ cls: classs })
  })
})

//更新
router.put('/:id', adminMiddleware, function (req, res) {
  Class.update({ _id: req.params.id }, { $set: { name: req.body.name, grade: req.body.grade } }, (err) => {
    res.json({ success: true });
  })
});

//删除
router.delete('/:id', adminMiddleware, function (req, res) {
  Class.findOneAndRemove({ _id: req.params.id }, (err, classs) => {
    if (err) throw err;
    User.update({ class: classs._id }, { $set: { class: null } }, (err) => {
      if (err) throw err;
      res.json({ success: true })
    })
  })
})

module.exports = router