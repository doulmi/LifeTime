import express from 'express'
import adminMiddleware from '../middlewares/adminMiddleware'
import teacherMiddleware from '../middlewares/teacherMiddleware'

import Class from '../models/class'
import User from '../models/user'
import Check from '../models/check'
import Schedual from '../models/schedual'
import mongoose from "mongoose"
const ObjectId = mongoose.Types.ObjectId

const router = express.Router()

//student : checked
//schedualId
//classId
//保存老师发送的学生打卡情况
router.post('/schedual/saveAll', teacherMiddleware, (req, res) => {
  let bulk = Check.collection.initializeOrderedBulkOp();
  let keys = Object.keys(req.body.checks);

  keys.map(key => {
    bulk.find({ schedual: ObjectId(req.body.schedualId), student: ObjectId(key), class: ObjectId(req.body.classId)})
    .upsert()
    .update({$set: {check: true}})
  })
  
  bulk.execute((err) => {
    if (err) {
      res.status(301).json({ success: false })
    } else {
      res.json({ success: true })
    }
  });
})

/**
 * 取得一节课的
 */
router.get('/schedual/:schedualId', teacherMiddleware, (req, res) => {
   Check.find({schedual: req.params.schedualId}) 
   .exec((err, checks) => {
     res.json({checks})
   })
})

//取得一门课程该班级所有学生的打卡数: studentId: checkNumber 形式
router.get('/:classId/:courseId', teacherMiddleware, (req, res) => {
  let classId = req.params.classId;
  let courseId = req.params.courseId;
  
  Check.find({class: ObjectId(classId)})
    .populate('schedual')
    .exec((err, checks) => {
      let results = {};
      
      checks.map(check => {
        if(results[check.student] == undefined) {
          results[check.student] = 0
        }
        results[check.student] ++;
      })

      res.json({studentChecks: results})
    })
});

module.exports = router