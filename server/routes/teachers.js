import express from 'express'
import adminMiddleware from '../middlewares/adminMiddleware'
import teacherMiddleware from '../middlewares/teacherMiddleware'
import superAdminMiddleware from '../middlewares/superAdminMiddleware'
import Role from '../models/role'
import User from '../models/user'

const router = express.Router()

/**
 * 将老师升级为管理员
 */
router.put('/upgrade/:teacherId', superAdminMiddleware, (req, res) => {
  Role.findOne({ slug: 'admin' }, (err, adminRole) => {
    if (err) throw err;
    User.findOne({ _id: req.params.teacherId })
      .populate('classes')
      .exec((err, user) => {
        if(err) throw err;
        user.role = adminRole._id;
        user.save(() => {
          user.role = adminRole;
          res.json({user});
        });
      })
  })
})

/**
 * 将管理员降级为老师
 */
router.put('/downgrade/:teacherId', superAdminMiddleware, (req, res) => {
  Role.findOne({ slug: 'teacher' }, (err, teacherRole) => {
    if (err) throw err;
    User.findOne({ _id: req.params.teacherId })
      .populate('classes')
      .exec((err, user) => {
        if(err) throw err;
        user.role = teacherRole._id;
        user.save(() => {
          user.role = teacherRole;
          res.json({user});
        });
      })
  })
})

/**
 * 取得所有老师
 */
router.get('/fetchAll', adminMiddleware, (req, res) => {
  Role.find({ $or : [{slug: 'teacher'}, {slug: 'admin'}] }, (err, teacherRoles) => {
    if (err) throw err;

    let condition = {};
    condition['$or'] = []; 
    teacherRoles.map(role => {
      condition['$or'].push({ role: role._id });
    })

    User.find(condition, (err, teachers) => {
      if (err) throw err;
      res.json({ teachers });
    });
  })
});

//分页取得所有Teacher
router.get('/:limit/:page', adminMiddleware, (req, res) => {
  let limit = Number(req.params.limit);
  let page = Number(req.params.page);

  let search = req.query.search;
  let classs = req.query.class;
  let grade = req.query.grade;
  let sex = req.query.sex;
  let user = req.user;

  Role.find({ $or : [{slug: 'teacher'}, {slug: 'admin'}]}, (err, teacherRoles) => {
    if (err) throw err;

    let condition = {};
    if (sex != undefined) {
      condition['sex'] = sex;
    }

    if (search != undefined && search != '') {
      condition['$or'] = [{ userId: { '$regex': '.*' + search + '.*' } }, { name: { '$regex': '.*' + search + '.*' } }];
    }

    let roleCondition = {};
    roleCondition['$or'] = []; 
    teacherRoles.map(role => {
      roleCondition['$or'].push({ role: role._id });
    })
    roleCondition['isDeleted'] = false;
    
    let countQuery = User.count(roleCondition);

    countQuery.where(condition);
    countQuery.exec((err, count) => {
      if (err) throw err;
      let query = User.find(roleCondition);
      query.where(condition);

      query
        .populate('classes')
        .populate('role')
        .skip(limit * page)
        .limit(limit)
        .exec((err, teachers) => {
          if (err) throw err;
          let total = parseInt(Math.ceil((parseFloat(count) / limit)));
          res.json({ teachers, total: total });
        })
    });
  })
});

module.exports = router