import express from 'express'
import studentMiddleware from '../middlewares/studentMiddleware'
import Achievement from '../models/achievement'
import User from '../models/user'

const router = express.Router()

//取得所有Achievement
router.get('/:limit/:page', function (req, res) {
  let user = req.user;
  let limit = Number(req.params.limit);
  let page = Number(req.params.page);

  if (user.role.slug == 'admin' || user.role.slug == 'superAdmin') {  //管理员可以看到所有的
    let student = req.query.student;
    let search = req.query.search;

    //取得限制条件
    let achievementCondition = {};

    if (student != undefined) {
      achievementCondition['user'] = student;
    }

    if (search != undefined && search.trim() != '') {
      achievementCondition['title'] = { '$regex': '.*' + search + '.*' };
    }

    Achievement.count(achievementCondition)
      .exec((err, count) => {
        Achievement.find(achievementCondition)
          .sort('-happenAt')
          .skip(limit * page)
          .limit(limit)
          .populate('user')
          .exec((err, achievements) => {
            if (err) throw err;
            let total = parseInt(Math.ceil((parseFloat(count) / limit)))
            res.json({ achievements, total });
          })
      });
  } else if (user.role.slug == 'teacher') { //老师只能看到自己添加的部分
    let condition = {};
    condition['class'] = { $in: user.classes }

    User.find(condition)
      .select('_id')
      .exec((err, students) => {
        if (err) throw err;

        let student = req.query.student;
        let search = req.query.search;

        //取得限制条件
        let achievementCondition = {};

        if (student != undefined) {
          achievementCondition['user'] = student;
        } else {
          achievementCondition['user'] = { $in: students };
        }

        if (search != undefined && search.trim() != '') {
          achievementCondition['title'] = { '$regex': '.*' + search + '.*' };
        }

        Achievement.count(achievementCondition)
          .exec((err, count) => {
            Achievement.find(achievementCondition)
              .sort('-happenAt')
              .skip(limit * page)
              .limit(limit)
              .populate('user')
              .exec((err, achievements) => {
                if (err) throw err;
                let total = parseInt(Math.ceil((parseFloat(count) / limit)))
                res.json({ achievements, total });
              })
          })
      });
  } else {  //学生自己看到自己的
    Achievement.count({ user: user.id })
      .exec((err, count) => {
        Achievement.find({ user: user.id })
          .sort('-happenAt')
          .skip(limit * page)
          .limit(limit)
          .exec((err, achievements) => {
            if (err) throw err;
            let total = parseInt(Math.ceil((parseFloat(count) / limit)))
            res.json({ achievements, total });
          });
      })
  }
})

//添加荣誉
router.post('/', function (req, res) {
  let user = req.user;

  let achievement = new Achievement(req.body);

  
  achievement.save(err => {
    if (err) throw err;
    res.json({ achievement });
  });
})

//更新荣誉，除非是管理员，否则老师只能更新自己添加的荣誉
router.put('/:id', function (req, res) {
  let user = req.user;
  let condition = {};
  condition['_id'] = req.params.id;

  Achievement
    .findOne(condition)
    .populate('user')
    .exec((err, achievement) => {
      achievement.title = req.body.title;
      achievement.content = req.body.content;
      achievement.happenAt = req.body.happenAt;
      achievement.save((err) => {
        if (err) throw err;
        res.json({ achievement })
      })
    })
})

//去掉学生的荣誉，除非是管理员，否则老师只能删除自己添加的荣誉
router.delete('/:id', function (req, res) {
  let user = req.user;
  let condition = {};
  condition['_id'] = req.params.id;

  Achievement.findOneAndRemove(condition, (err, tag) => {
    if (err) throw err;
    res.json({ success: true });
  })
})

module.exports = router