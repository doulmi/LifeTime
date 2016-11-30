import express from 'express'
import adminMiddleware from '../middlewares/adminMiddleware'
import teacherMiddleware from '../middlewares/teacherMiddleware'
import Schedual from '../models/schedual'
import Class from '../models/class'
import Course from '../models/course'

const router = express.Router()

/**
 * 重新安排所有课程表
 */
router.post('/arrangeSchedual', function (req, res) {
  //删除所有课程表
  Schedual.remove({}, (err) => {
    //找到所有属于一年级的课程
    
    //找到所有班级
    Class.find({}, (err, classes) => {
      //对每个班级进行课程安排
    })
  })
})

//取得所有schedual
router.get('/:classId/:start/:end', function (req, res) {
  let user = req.user;

  let [year1, month1, date1] = req.params.start.split('-');
  let [year2, month2, date2] = req.params.end.split('-');

  let start = new Date(year1, month1 - 1, date1, 0, 0, 0);
  let end = new Date(year2, month2 - 1, date2, 23, 59, 59);

  Schedual.find({ class: req.params.classId, "date": { "$gte": start, "$lte": end } })
    .sort('-start')
    .populate('class')
    .populate('course')
    .deepPopulate('course.teacher')
    .exec((err, scheduals) => {
      if (err) throw err;
      res.json({ scheduals});
    });
});

//取得该老师的schedual
router.get('/teacher/:teacherId/:start/:end', function (req, res) {
  let user = req.user;

  let [year1, month1, date1] = req.params.start.split('-');
  let [year2, month2, date2] = req.params.end.split('-');

  let start = new Date(year1, month1 - 1, date1, 0, 0, 0);
  let end = new Date(year2, month2 - 1, date2, 23, 59, 59);

  Course.find({teacher: req.params.teacherId}, (err, courses) => {
    
    if(err) throw err;
    let coursesId = courses.map(course =>{
      return course._id
    });
    
   Schedual.find({ course: {$in: coursesId}, "date": { "$gte": start, "$lte": end } })
    .sort('-start')
    .populate('class')
    .populate('course')
    .deepPopulate('course.teacher')
    .exec((err, scheduals) => {
      if (err) throw err;
      res.json({ scheduals});
    });
  })
});

/** 
 * 根据id取得内容
*/
router.get('/:schedualId', teacherMiddleware, (req, res) => {
  Schedual.findOne({_id: req.params.schedualId})
    .populate('class')
    .populate('coures')
    .deepPopulate('course.teacher')
    .exec((err, schedual) => {
      if(err) throw err;
      res.json({schedual});
    })
});

router.post('/:classId', adminMiddleware, (req, res) => {

  Class.findOne({ _id: req.params.classId }, (err, cls) => {
    if (err) throw err;

    Course.findOne({ _id: req.body.course }, (err, course) => {
      if (err) throw err;

      let schedual = new Schedual({
        date: req.body.date,
        class: req.params.classId,
        index: req.body.index,
        course: req.body.course
      });

      schedual.save({}, (err) => {
        schedual.course = course;
        schedual.class = cls;
        res.json({ schedual });
      });
    })
  })
})

router.put('/:id', adminMiddleware, (req, res) => {

  Schedual.findOne({ _id: req.params.id }, (err, schedual) => {
    schedual.date = req.body.date;
    schedual.class = req.body.class;
    schedual.index = req.body.index;
    schedual.course = req.body.course;
    schedual.save(() => {
      res.json({ schedual })
    })
  })
})

router.delete('/:id', adminMiddleware, (req, res) => {
  Schedual.findByIdAndRemove({ _id: req.params.id }, (err) => {
    res.json({ success: true })
  })
})

module.exports = router