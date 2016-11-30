import express from 'express'
import superAdminMiddleware from '../middlewares/superAdminMiddleware'
import multer from 'multer'
import xlsx from 'xlsx'
import mongoose from 'mongoose'
import Role from '../models/role'
import User from '../models/user'
import Class from '../models/class'
import Task from '../models/task'
import Achievement from '../models/achievement'
import Punishment from '../models/punishment'
import Tag from '../models/tag'
import Mood from '../models/mood'
import Optique from '../models/optique'

const ObjectId = mongoose.Types.ObjectId

const router = express.Router()

router.post('/uploadStudents', superAdminMiddleware, multer({ dest: "./uploads/" }).single("file"), function (req, res) {
  let students = getJson(req.file);
  let bulk = Class.collection.initializeOrderedBulkOp();
  
  //先取出班级中的重复项，然后插入班级
  var uniqueClass = {};
  students.map(student => {
    let grade = student['年级'];
    let name = student['班级'];
    uniqueClass[grade + name] = { grade, name }
  });
  
  Object.keys(uniqueClass).map(key=> {
    let cls = uniqueClass[key];
    bulk.find(cls).upsert().update({ $set: {created_at: new Date()}});
  })

  bulk.execute((err) => {
    if(err) throw err;
    students.map(student => {
      transferStudentStrategy(student);
    })
  })

  res.send({ success: true });
});


router.post('/uploadTeachers', superAdminMiddleware, multer({ dest: "./uploads/" }).single("file"), function (req, res) {
  let teachers = getJson(req.file);
  let results = [];
  console.log('teachers insert');
  teachers.map(teacher=> {
    transferTeacherStrategy(teacher);
  })
  res.send({ success: true, teachers: results });
});


const getJson = (file) => {
  let workbook = xlsx.readFile(file.destination + file.filename);
  let sheet1 = workbook.Sheets[workbook.SheetNames[0]]
  let json = xlsx.utils.sheet_to_row_object_array(sheet1);
  return json
}

/* 将excel行转成对于学生的策略，根据excel的不同，该方法则不同 */
const transferStudentStrategy = (studentJson) => {
  Role.findOne({ slug: 'student' })
    .exec((err, role) => {
      if (err) throw err;
      Class.findOne({ grade: studentJson['年级'], name: studentJson['班级'] }).exec((err, cls) => {
        if (err) throw err;
        let student = new User({
          password: '$2a$10$BuyTAneBm3srcJg5LmRU4.ozuB3.mdn3bzrVLvX6rZmF8bJF7do5i', //123456
          sex: studentJson['性别'] == '男' ? 'M' : 'F',
          userId: studentJson['学号'],
          role: role._id,
          name: studentJson['姓名'],
          birthday: new Date(studentJson['出生日期']),
          address: studentJson['住址'],
          phone: studentJson['电话'],
          grade: studentJson['年级'],
          room: studentJson['宿舍'],
        });

        //班级不存在时，需要先插入班级
        if (cls == undefined) {
          let classs = new Class({
            grade: studentJson['年级'],
            name: studentJson['班级'],
          })
          classs.save((err, classs) => {
            if (err) throw err;
            student.class = classs._id;
            student.save();
          })
        } else {
          student.class = cls._id;
          student.save();
        }
      })
    });
}


/* 将excel行转成对于老师的策略，根据excel的不同，该方法则不同 */
const transferTeacherStrategy = (studentJson) => {
  Role.findOne({ slug: 'teacher' })
    .exec((err, role) => {
      if (err) throw err;
      let teacher = new User({
        password: '$2a$10$BuyTAneBm3srcJg5LmRU4.ozuB3.mdn3bzrVLvX6rZmF8bJF7do5i', //123456
        sex: studentJson['性别'] == '男' ? 'M' : 'F',
        userId: studentJson['工号'],
        role: role._id,
        name: studentJson['姓名'],
        birthday: new Date(studentJson['出生日期']),
        address: studentJson['住址'],
        phone: studentJson['电话'],
        room: studentJson['宿舍'],
      });
      teacher.save();
    });
}


module.exports = router