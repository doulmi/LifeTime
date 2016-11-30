import express from 'express'
import studentMiddleware from '../middlewares/studentMiddleware'
import teacherMiddleware from '../middlewares/teacherMiddleware'
import adminMiddleware from '../middlewares/adminMiddleware'
import Course from '../models/course'
import Class from '../models/class'
const router = express.Router()

/**
 * 取得所有课程
 */
router.get('/fetchAll', adminMiddleware, (req, res) => {
  Course.find({})
    .exec((err, courses) => {
      if (err) throw err;
      res.json({ courses })
    })
});

/**
 * 根据id取得course
 */
router.get('/:id', teacherMiddleware, (req, res) => {
  Course.findOne({ _id: req.params.id })
    .exec((err, course) => {
      if (err) throw err;
      res.json({ course });
    })
});

/**
 * 根据班级和老师取得对应的课程
 */
router.get('/class/:classId/:teacherId', teacherMiddleware, (req, res) => {
  Class.findOne({ _id: req.params.classId })
    .exec((err, cls) => {
      if (err) throw err;
      if (cls) {
        Course.find({ grade: cls.grade, teachher: _req.params.teacherId }, (err, courses) => {
          if (err) throw err;
          res.json({ coruses })
        })
      } else {
        res.json({ courses: [] })
      }
    })
})

//根据年级取得所有课程
router.get('/class/:classId', teacherMiddleware, (req, res) => {
  Class.findOne({ _id: req.params.classId })
    .exec((err, cls) => {
      if (err) throw err;
      if (cls) {
        Course.find({ grade: cls.grade }, (err, courses) => {
          if (err) throw err;
          res.json({ coruses })
        })
      } else {
        res.json({ courses: [] })
      }
    })
})

/**
 * 取得该老师所教授的所有课程
 */
router.get('/teacher/:teacherId', teacherMiddleware, (req, res) => {
  Course.find({ teacher: req.params.teacherId })
    .exec((err, courses) => {
      if (err) throw err;
      res.json({ courses });
    })
})

//取得所有courses
router.get('/:limit/:page', adminMiddleware, function (req, res) {
  let user = req.user;
  let limit = parseInt(req.params.limit);
  let page = parseInt(req.params.page);

  let search = req.query.search;
  let grade = req.query.grade;
  let semester = req.query.semester;

  //取得限制条件
  let condition = {};

  if (grade != undefined) {
    condition['grade'] = grade;
  }

  if (semester != undefined) {
    condition['semester'] = semester;
  }

  if (search != undefined && search.trim() != '') {
    condition['name'] = { '$regex': '.*' + search + '.*' };
  }

  Course.find(condition)
    .limit(limit)
    .skip(limit * page)
    .exec((err, courses) => {
      if (err) throw err;
      res.json({ courses });
    });
});

//添加Course
router.post('/', adminMiddleware, function (req, res) {
  let user = req.user;

  let course = new Course(req.body);

  course.save((err) => {
    if (err) throw err;
    res.json({ course })
  })
})

//更新
router.put('/:id', adminMiddleware, (req, res) => {
  Course.findOne({ _id: req.params.id })
    .exec((err, course) => {
      if (err) throw err;
      course.teacher = req.body.teacher;
      course.code = req.body.code;
      course.name = req.body.name;
      course.desc = req.body.desc;
      course.grade = req.body.grade;
      course.semester = req.body.semester;
      course.hours = req.body.hours;
      course.credits = req.body.credits;
      course.color = req.body.color;
      course.save((err) => {
        res.json({ success: true })
      });
    });
})

//删除
router.delete('/:id', adminMiddleware, function (req, res) {
  Course.findOneAndRemove({ _id: req.params.id }, (err, tag) => {
    if (err) throw err;
    res.json({ success: true });
  })
})



module.exports = router