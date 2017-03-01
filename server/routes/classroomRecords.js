import express from 'express'
import studentMiddleware from '../middlewares/studentMiddleware'
import ClassroomRecord from '../models/classroomRecord'
import User from '../models/user'
import adminMiddleware from '../middlewares/adminMiddleware'

const router = express.Router()

//取得所有教室记录
router.get('/:limit/:page', adminMiddleware, function (req, res) {
  let user = req.user;
  let limit = Number(req.params.limit);
  let page = Number(req.params.page);

  if (user.role.slug == 'admin' || user.role.slug == 'superAdmin') {
    let teacher = req.query.teacher;

    //取得限制条件
    let classroomRecordCondition = {};

    if (teacher != undefined) {
      classroomRecordCondition['user'] = teacher;
    }

    ClassroomRecord.count(classroomRecordCondition)
      .exec((err, count) => {
        ClassroomRecord.find(classroomRecordCondition)
          .sort('-createdAt')
          .skip(limit * page)
          .limit(limit)
          .populate('user')
          .exec((err, classroomRecords) => {
            if (err) throw err;
            let total = parseInt(Math.ceil((parseFloat(count) / limit)))
            res.json({ classroomRecords, total });
          })
      });
  }
})

//添加教室记录
router.post('/', adminMiddleware, function (req, res) {
  let user = req.user;

  let classroomRecord = new ClassroomRecord(req.body);


  classroomRecord.save(err => {
    if (err) throw err;
    res.json({ classroomRecord });
  });
})

//更新教室记录
router.put('/:id', adminMiddleware, function (req, res) {
  let user = req.user;
  let condition = {};
  condition['_id'] = req.params.id;

  ClassroomRecord
    .findOne(condition)
    .populate('user')
    .exec((err, classroomRecord) => {
      classroomRecord.title = req.body.title;
      classroomRecord.content = req.body.content;
      classroomRecord.happenAt = req.body.happenAt;
      classroomRecord.save((err) => {
        if (err) throw err;
        res.json({ classroomRecord })
      })
    })
})

router.delete('/:id', adminMiddleware, function (req, res) {
  let user = req.user;
  let condition = {};
  condition['_id'] = req.params.id;

  ClassroomRecord.findOneAndRemove(condition, (err, tag) => {
    if (err) throw err;
    res.json({ success: true });
  })
})

module.exports = router