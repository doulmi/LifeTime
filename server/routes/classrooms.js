import express from 'express'
import studentMiddleware from '../middlewares/studentMiddleware'
import Classroom from '../models/classroom'
import adminMiddleware from '../middlewares/adminMiddleware'
import User from '../models/user'

const router = express.Router()

//取得所有Classroom
router.get('/:limit/:page', adminMiddleware, function (req, res) {
  let user = req.user;
  let limit = Number(req.params.limit);
  let page = Number(req.params.page);

  Classroom.count()
    .exec((err, count) => {
      Classroom.find()
        .sort('-createdAt')
        .skip(limit * page)
        .limit(limit)
        .exec((err, classrooms) => {
          if (err) throw err;
          let total = parseInt(Math.ceil((parseFloat(count) / limit)))
          res.json({ classrooms, total });
        });
    });
});

//返回所有教室信息
router.get('/', adminMiddleware, function (req, res) {
  Classroom.find()
    .sort('-createdAt')
    .exec((err, classrooms) => {
      if (err) throw err;
      res.json({ classrooms });
    });
});

//添加教室
router.post('/', adminMiddleware, function (req, res) {
  let user = req.user;

  let classroom = new Classroom(req.body);
  classroom.save(err => {
    if (err) throw err;
    res.json({ classroom });
  });
})

//更新教室
router.put('/:id', adminMiddleware, function (req, res) {
  let user = req.user;
  let condition = {};
  condition['_id'] = req.params.id;

  Classroom
    .findOne(condition)
    .exec((err, classroom) => {
      classroom.name = req.body.name;
      classroom.save((err) => {
        if (err) throw err;
        res.json({ classroom })
      })
    })
})

//删除教室
router.delete('/:id', adminMiddleware, function (req, res) {
  let condition = {};
  condition['_id'] = req.params.id;

  Classroom.findOneAndRemove(condition, (err, tag) => {
    if (err) throw err;
    res.json({ success: true });
  })
})

module.exports = router