import express from 'express'
import studentMiddleware from '../middlewares/studentMiddleware'
import adminMiddleware from '../middlewares/adminMiddleware'
import teacherMiddleware from '../middlewares/teacherMiddleware'
import Role from '../models/role'
import User from '../models/user'

const router = express.Router()

/**
 * 根据班级取回学生
 */
router.get('/class/:classId', teacherMiddleware, (req, res) => {
  User.find({ class: req.params.classId })
    .populate('class')
    .populate('role')
    .exec((err, students) => {
      if (err) throw err;
      res.json({ students });
    })
})

/**
 * 分页取得学生
 */
router.get('/:limit/:page', teacherMiddleware, (req, res) => {
  let limit = Number(req.params.limit);
  let page = Number(req.params.page);

  let search = req.query.search;
  let classs = req.query.class;
  let grade = req.query.grade;
  let sex = req.query.sex;
  let user = req.user;

  Role.findOne({ slug: 'student' }, (err, studentRole) => {
    if (err) throw err;

    let condition = {};
    if (sex != undefined) {
      condition['sex'] = sex;
    }

    if (grade != undefined) {
      condition['grade'] = grade;
    }

    if (search != undefined && search != '') {
      condition['$or'] = [{ userId: { '$regex': '.*' + search + '.*' } }, { name: { '$regex': '.*' + search + '.*' } }];
    }

    if (user.role.slug == 'teacher') {  //如果是普通老师，则提供上课班级的学生名单
      if (classs == undefined) {
        condition['class'] = { $in: user.classes }
      } else {  //选择的班级是否在老师的任职班级中
        if (user.classes.indexOf(classs) > -1) {//是
          condition['class'] = classs;
        } else {
          condition['class'] = 'NOT_EXIST';
        }
      }
    } else if (user.role.slug == 'admin') {
      if (classs != undefined) {
        condition['class'] = classs;
      }
    }

    let countQuery = User.count({ role: studentRole.id, isDeleted: false });

    countQuery.where(condition);

    countQuery.exec((err, count) => {
      if (err) throw err;
      let query = User.find({ role: studentRole.id, isDeleted: false });
      query.where(condition);

      query
        .populate('class')
        .populate('role')
        .skip(limit * page)
        .limit(limit)
        .exec((err, students) => {
          if (err) throw err;
          let total = parseInt(Math.ceil((parseFloat(count) / limit)));
          res.json({ students, total: total });
        })
    });
  })
});

module.exports = router