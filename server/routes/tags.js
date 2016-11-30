import express from 'express'
import studentMiddleware from '../middlewares/studentMiddleware'
import Task from '../models/task'
import Tag from '../models/tag'
const router = express.Router()

//取得所有tag
router.get('/', studentMiddleware, function (req, res) {
  let user = req.user;

  Tag.find({ user: user.id })
    .sort('-createdAt')
    .exec((err, tags) => {
      if (err) throw err;
      res.json({ tags });
    });
});

//添加tag
router.post('/', studentMiddleware, function (req, res) {
  let user = req.user;
  let tag = new Tag({
    user: user.id,
    name: req.body.name,
    color: req.body.color
  })
  tag.save((err) => {
    if (err) {
      res.status(301).json({success: false})
      throw err;
    } else {
      res.json({ tag })
    }
  })
})

router.put('/:id', studentMiddleware, function (req, res) {
  let user = req.user;
  Tag.update({ _id: req.params.id }, { $set: { name: req.body.name, color: req.body.color } }, (err) => {
    if (err) {
      res.status(301).json({success: false});
      throw err;
    }
    Tag.find({ user: user.id }, (err, tags) => {
      if (err) {
        res.status(301).json({success: false});
        throw err;
      } 
      res.json({ tags });
    });
  })
});

router.delete('/:id', studentMiddleware, function (req, res) {
  Tag.findOneAndRemove({ _id: req.params.id, user: req.user.id }, (err, tag) => {
    if (err) throw err;
    //delete tasks' tag
    Task.update({ tag: req.params.id }, { $set: { tag: null } }, (err) => {
      if (err) {
        res.status(301).json({success: false});
        throw err;
      }
      res.json({ success: true });
    });
  })
})

module.exports = router