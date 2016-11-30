import express from 'express'
import studentMiddleware from '../middlewares/studentMiddleware'
import teacherMiddleware from '../middlewares/teacherMiddleware'
import Mood from '../models/mood'
const router = express.Router()


//取得所有moods
router.get('/fetch/:id', teacherMiddleware, function (req, res) {
  let id = req.params.id;
  
  Mood.find({ user: id })
    .sort('-createdAt')
    .exec((err, moods) => {
      if (err) throw err;
      res.json({ moods });
    });
});

//取得所有moods
router.get('/:limit/:page', studentMiddleware, function (req, res) {
  let user = req.user;
  let limit = parseInt(req.params.limit);
  let page = parseInt(req.params.page);

  Mood.find({ user: user.id })
    .sort('-createdAt')
    .limit(limit)
    .skip(limit * page)
    .exec((err, moods) => {
      if (err) throw err;
      res.json({ moods });
    });
});

//添加Mood
router.post('/', studentMiddleware, function (req, res) {
  let user = req.user;
  
  let mood = new Mood({
    user: user.id,
    slug: req.body.slug,
    color: req.body.color,
    text: req.body.text
  })
  
  mood.save((err) => {
    if (err) throw err;
    res.json({ mood })
  })
})

router.delete('/:id', studentMiddleware, function (req, res) {
  Mood.findOneAndRemove({ _id: req.params.id, user: req.user.id }, (err, tag) => {
    if (err) throw err;
    res.json({ success: true });
  })
})


module.exports = router