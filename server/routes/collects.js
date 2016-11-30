import express from 'express'
import teacherMiddleware from '../middlewares/teacherMiddleware'
import adminMiddleware from '../middlewares/adminMiddleware'
import Collect from '../models/collect'
import Class from '../models/class'
import User from '../models/user'

const router = express.Router()

//取得所有未提交的名单
router.get('/notsubmit/:userId', teacherMiddleware, (req, res) => {
  Collect.find({isSubmit: false})
    .sort('-createdAt')
    .exec((err, collects) => {
      if (err) throw err;
      res.json({ collects });
    })
})

//在collect中加入一个学生
router.put('/:collectId/:studentId', teacherMiddleware, (req, res) => {
  let collectId = req.params.collectId;
  let studentId = req.params.studentId;

  Collect.findOne({ _id: collectId })
    .exec((err, collect) => {
      if (err) throw err;
      let duplicate = false;
      collect.students.map(student => {
        if (student._id == studentId) {
          duplicate = true;
        }
      })

      if (!duplicate) {
        collect.students.push(studentId);
        collect.save();
      }
      res.json({ success: true })

    })
});

//取得所有Collect
router.get('/:limit/:page', teacherMiddleware, function (req, res) {
  let user = req.user;
  let limit = Number(req.params.limit);
  let page = Number(req.params.page);

  // if (user.role.slug == 'admin') {
// 
  // } else if (user.role.slug == 'teacher') {
    let search = req.query.search;

    //取得限制条件
    let collectCondition = {};
    // collectCondition['user'] = user._id;

    if (search != undefined && search.trim() != '') {
      collectCondition['title'] = { '$regex': '.*' + search + '.*' };
    }

    Collect.count(collectCondition)
      .exec((err, count) => {
        Collect.find(collectCondition)
          .sort('-createdAt')
          .skip(limit * page)
          .limit(limit)
          .populate('user')
          .exec((err, collects) => {
            if (err) throw err;

            let total = parseInt(Math.ceil((parseFloat(count) / limit)))
            res.json({ collects, total });
          })
      })
  // }
})

//添加名单
router.post('/', adminMiddleware, function (req, res) {
  let user = req.user;

  let collect = new Collect(req.body);
  collect.user = user._id;

  collect.save(err => {
    if (err) throw err;
    collect.user = user;
    res.json({ collect });
  });
})

router.put('/:id', adminMiddleware, function (req, res) {
  Collect
    .findOne({ _id: req.params.id })
    .exec((err, collect) => {
      collect.title = req.body.title;
      collect.content = req.body.content;
      collect.isSubmit = req.body.isSubmit;
      collect.save((err) => {
        if (err) throw err;
        res.json({ succes: true })
      })
    })
})

// 去掉名单
router.delete('/:id', adminMiddleware, function (req, res) {
  Collect.findOneAndRemove({ _id: req.params.id }, (err, tag) => {
    if (err) throw err;
    res.json({ success: true });
  })
})

//从名单中去除一个学生的名字
router.delete('/:collectId/:studentId', teacherMiddleware, function (req, res) {
  let collectId = req.params.collectId;
  let studentId = req.params.studentId;

  Collect.findOne({ _id: collectId }, (err, collect) => {
    if (err) throw err;
    collect.students = collect.students.filter(student => {
      return student != studentId;
    })

    collect.save();
    res.json({ success: true });
  });
});

//取得collect
router.get('/:collectId', teacherMiddleware, (req, res) => {
  let collectId = req.params.collectId;

  Collect.findOne({ _id: collectId })
    .populate('students user')
    .deepPopulate('students.class students.role')
    .exec((err, collect) => {
      if (err) throw err;
      res.json({ collect });
    })
})

module.exports = router