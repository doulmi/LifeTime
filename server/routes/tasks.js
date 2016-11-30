import express from 'express'
import User from '../models/user'
import Task from '../models/task'
import Tag from '../models/tag'
import studentMiddleware from '../middlewares/studentMiddleware'
import teacherMiddleware from '../middlewares/teacherMiddleware'
import { getYmd } from '../utils/timer'

const router = express.Router();

//取得
router.get('/:limit/:page', studentMiddleware, (req, res) => {
  let user = req.user;

  let limit = parseInt(req.params.limit);
  let page = parseInt(req.params.page);
  Task.find({ user: user.id })
    .sort('-created_at')
    .limit(limit)
    .populate('tag', 'name color')
    .skip(limit * page)
    .exec((err, tasks) => {
      if (err) { throw err; }
      res.json({ tasks });
    });
})

//删除task
router.delete('/:taskId', studentMiddleware, (req, res) => {
  Task.findOneAndRemove({ _id: req.params.taskId, user: req.user.id }, (err, task) => {
    if (err) throw err;
    res.json({ success: true });
  })
});

//添加task
router.post('/', studentMiddleware, (req, res) => {
  let user = req.user;
  req.body.user = user.id;

  if (req.body.tag == '') {
    req.body.tag = null
  }

  let task = new Task(req.body);

  Tag.findOne({ _id: req.body.tag }, (err, tag) => {
    task.save(err => {
      if (err) throw err;
      task.tag = tag;
      res.json({ success: true, task: task });
    });
  })
});


//按照启示时间和终止时间获取Task
router.get('/date/:start/:end', studentMiddleware, (req, res) => {
  let user = req.user;

  let [year1, month1, date1] = req.params.start.split('-');
  let [year2, month2, date2] = req.params.end.split('-');

  let start = new Date(year1, month1 - 1, date1, 0, 0, 0);
  let end = new Date(year2, month2 - 1, date2, 23, 59, 59);

  Task.find({ "created_at": { "$gte": start, "$lte": end }, user: user.id })
    .populate('tag', 'name color')
    .exec((err, tasks) => {
      if (err) throw err;
      res.json({ tasks });
    });
});

//教师查询学生状态
router.get('/fetch/:id/:start/:end', teacherMiddleware, (req, res) => {

  let [year1, month1, date1] = req.params.start.split('-');
  let [year2, month2, date2] = req.params.end.split('-');

  let start = new Date(year1, month1 - 1, date1, 0, 0, 0);
  let end = new Date(year2, month2 - 1, date2, 23, 59, 59);
  let id = req.params.id;

  User.findOne({ _id: id }, (err, user) => {
    if (err) throw err;
    Task.find({ "created_at": { "$gte": start, "$lte": end }, user: user.id  })
      .populate('tag', 'name color')
      .exec((err, tasks) => {

        if (err) throw err;
        res.json({ tasks });
      });
  })
});

module.exports = router