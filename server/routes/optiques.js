import express from 'express'
import studentMiddleware from '../middlewares/studentMiddleware'
import teacherMiddleware from '../middlewares/teacherMiddleware'
import Optique from '../models/optique'
import User from '../models/user'

const router = express.Router()

//取得所有Optique
router.get('/', studentMiddleware, function (req, res) {
  let user = req.user;

  Optique.find({ user: user.id })
    .sort('date')
    .exec((err, optiques) => {
      if (err) throw err;
      res.json({ optiques });
    });
})

//修改optique
router.put('/:id', studentMiddleware, function (req, res) {
  let user = req.user;

  Optique.findOne({ _id: req.params.id, user: user.id }, (err, optique) => {
    if (err) throw err;
    optique.left = req.body.left;
    optique.right = req.body.right;
    optique.date = req.body.date;
    optique.save(err => {
      Optique.find({ user: user.id }, (err, optiques) => {
        if (err) throw err;
        res.json({ optiques });
      })
    })
  })
});

//添加Optique
router.post('/', studentMiddleware, function (req, res) {
  let user = req.user;

  Optique.findOne({user: user.id, date: req.body.date}, (err, optique) => {
      if(err)  throw err;
      if(optique)  {
        optique.left = req.body.left;
        optique.right = req.body.right
        optique.save(() => {
          res.json({ optique });
        });        
      } else {
        let optique = new Optique({
          user: user.id,
          date: req.body.date,
          left: req.body.left,
          right: req.body.right
        });
        optique.save(err => {
          if (err) throw err;
          res.json({ optique });
        });
      }
  })

 })

//去掉学生的 Optique
router.delete('/:id', studentMiddleware, function (req, res) {
  let user = req.user;
  Optique.findOneAndRemove({ _id: req.params.id, user: user.id }, (err, tag) => {
    if (err) throw err;
    res.json({ success: true });
  })
})

//教师端查看学生的信息
router.get('/fetch/:id', teacherMiddleware, function (req, res) {
  let id = req.params.id;
  User.findOne({_id: id}, (err, user) => {
    if(err) throw err;
    Optique.find({ user: user.id })
    .sort('date')
    .exec((err, optiques) => {
      if (err) throw err;
      res.json({ optiques });
    });
  })
})


module.exports = router