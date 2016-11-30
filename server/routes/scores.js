import express from 'express'
import Score from '../models/score'
import Course from '../models/course'
import User from '../models/user'
import teacherMiddleware from '../middlewares/teacherMiddleware'

import mongoose from "mongoose"
const ObjectId = mongoose.Types.ObjectId

const router = express.Router()

/**
 * 老师保存学生成绩
 */
router.post('/saveAll', teacherMiddleware, (req, res) => {
  let bulk = Score.collection.initializeOrderedBulkOp();
  let keys = Object.keys(req.body.scores);
  Course.findOne({_id: req.body.courseId}, (err, course) => {
    keys.map(key => {
      let note = req.body.scores[key];
      bulk.find({ course: ObjectId(req.body.courseId), student: ObjectId(key), semester: course.semester})
        .upsert()
        .updateOne({ $set: {note: note }});
    })
    
    bulk.execute((err) => {
      if (err) {
        res.status(301).json({ success: false })
      } else {
        res.json({ success: true })
      }
    });
  })
})

/**
 * 根据班级和课程返回所有分数
 */
router.get('/:courseId/:classId', teacherMiddleware, (req, res) => {
  console.log(req.params.classId);
  User.find({ class: req.params.classId })
    .exec((err, students) => {
      if (err) throw err;
      let ids = [];
      students.map(student => ids.push(student._id));
      Score.find({ course: req.params.courseId, student: { $in: ids } })
        .exec((err, scores) => {
        if (err) throw err;
        res.json({ scores })
      });
    })
});

/**
 * 取得该生所有成绩
 */
router.get('/:studentId', (req, res) => {
  Score.find({ student: req.params.studentId })
    .sort('semester')
    .populate('course')
    .exec((err, scores) => {
      if (err) throw err;
      console.log(scores);
      res.json({ scores })
    })
})

/**
 * 保存学生成绩
 */
router.post('/', (req, res) => {
  Course.findOne({ _id: req.body.course }, (err, course) => {
    if (err) throw err;
    let score = new Score({
      course: course._id,
      student: req.body.student,
      semester: course.semester,
      note: req.body.note
    })
    score.save(() => {
      score.course = course;
      res.json({ score })
    })
  })
})

/**
 * 修改学生成绩
 */
router.put('/:id', (req, res) => {
  Coruse.findOne({ _id: req.body.course }, (err, course) => {
    if (err) throw err;
    Score.findOne({ _id: req.params.id }, (err, score) => {
      score.course = req.body.course;
      score.semester = course.semester;
      score.note = req.body.note;
      score.save(() => {
        score.course = course;
        res.json({ score });
      })
    })

  });
})

module.exports = router