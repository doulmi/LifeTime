import express from 'express'
import studentMiddleware from '../middlewares/studentMiddleware'
import Punishment from '../models/punishment'
import User from '../models/user'

const router = express.Router()

//取得所有Punishment
router.get('/:limit/:page', function (req, res) {
  let user = req.user;
  let limit = Number(req.params.limit);
  let page = Number(req.params.page);

  if (user.role.slug == 'admin'|| user.role.slug == 'superAdmin') {
    let student = req.query.student;
    let search = req.query.search;

    //取得限制条件
    let punishmentCondition = {}

    if (student != undefined) {
      punishmentCondition['user'] = student;
    }
    
    if (search != undefined && search.trim() != '') {
      punishmentCondition['title'] = { '$regex': '.*' + search + '.*' };
    }

    Punishment.count(punishmentCondition)
      .exec((err, count) => {
        Punishment.find(punishmentCondition)
          .sort('-happenAt')
          .skip(limit * page)
          .limit(limit)
          .populate('user')
          .exec((err, punishments) => {
            if (err) throw err;
            let total = parseInt(Math.ceil((parseFloat(count) / limit)))
            res.json({ punishments, total });
          })
      })
  } else if (user.role.slug == 'teacher') { //老师看到自己所教学生的内容
    let condition = {};
    condition['class'] = { $in: user.classes }

    User.find(condition)
      .select('_id')
      .exec((err, students) => {
        if (err) throw err;

        let student = req.query.student;
        let search = req.query.search;

        //取得限制条件
        let punishmentCondition = {};

        if (student != undefined) {
          punishmentCondition['user'] = student;
        } else {
          punishmentCondition['user'] = { $in: students };
        }

        if (search != undefined && search.trim() != '') {
          punishmentCondition['title'] = { '$regex': '.*' + search + '.*' };
        }

        Punishment.count(punishmentCondition)
          .exec((err, count) => {
            Punishment.find(punishmentCondition)
              .sort('-happenAt')
              .skip(limit * page)
              .limit(limit)
              .populate('user')
              .exec((err, punishments) => {
                if (err) throw err;
                let total = parseInt(Math.ceil((parseFloat(count) / limit)))
                res.json({ punishments, total });
              })
          })
      });
  } else {  //学生只能看到自己的内容
    Punishment.count({ user: user.id })
      .exec((err, count) => {
        Punishment.find({ user: user.id })
          .sort('-happenAt')
          .skip(limit * page)
          .limit(limit)
          .exec((err, punishments) => {
            if (err) throw err;
            let total = parseInt(Math.ceil((parseFloat(count) / limit)))
            res.json({ punishments, total });
          });
      })
  }
})

//添加惩罚
router.post('/', function (req, res) {
  let user = req.user;

  let punishment = new Punishment(req.body);

  punishment.save(err => {
    if (err) throw err;
    res.json({ punishment });
  });
})

//更新惩罚，除非是管理员，否则老师只能更新自己添加的惩罚
router.put('/:id', function (req, res) {
  let user = req.user;
  let condition = {};
  condition['_id'] = req.params.id;

  Punishment
    .findOne(condition)
    .populate('user')
    .exec((err, punishment) => {
      punishment.title = req.body.title;
      punishment.content = req.body.content;
      punishment.happenAt = req.body.happenAt;
      punishment.save((err) => {
        if (err) throw err;
        res.json({ punishment })
      })
    })
})

//去掉学生的惩罚，除非是管理员，否则老师之恩能够删除自己添加的惩罚
router.delete('/:id', function (req, res) {
  let user = req.user;

  let condition = {};
  condition['_id'] = req.params.id;
  Punishment.findOneAndRemove(condition, (err, tag) => {
    if (err) throw err;
    res.json({ success: true });
  })
})

module.exports = router