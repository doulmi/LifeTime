import express from 'express'
import studentMiddleware from '../middlewares/studentMiddleware'
import adminMiddleware from '../middlewares/adminMiddleware'
import teacherMiddleware from '../middlewares/teacherMiddleware'
import Notification from '../models/notification'
const router = express.Router()

//取得所有Notification
router.get('/', (req, res) => {
  let user = req.user;

  Notification.find()
    .sort('-createdAt')
    .populate('from', 'name')
    .exec((err, notifications) => {
      if (err) throw err;
      res.json({ notifications });
    });
})

router.get('/:limit/:page', (req, res) => {
  let limit = Number(req.params.limit);
  let page = Number(req.params.page);
  let user = req.user;

  let condition = {};
  
  if (user.role.slug == 'student') {
    condition['to'] = 'student';
  } else if (user.role.slug == 'teacher') {
    condition['to'] = 'teacher';
  }
  
  Notification.count(condition, (err, count) => {
    if (err) throw err;
    Notification.find(condition)
      .sort('-createdAt')
      .skip(limit * page)
      .limit(limit)
      .populate('from', 'name')
      .exec((err, notifications) => {
        if (err) throw err;
        let total = parseInt(Math.ceil((parseFloat(count) / limit)));
        res.json({ notifications, total: total });
      })
  });
});

router.put('/:id', adminMiddleware, (req, res) => {
  Notification
    .findOne({ _id: req.params.id })
    .populate('from')
    .exec((err, notification) => {
      if (err) throw err;

      notification.title = req.body.title;
      notification.content = req.body.content;
      notification.to = req.body.to;
      notification.save((err) => {
        if (err) throw err;
        res.json({ notification })
      });
    });
});

//添加Notification
router.post('/', adminMiddleware, (req, res) => {
  let notification = new Notification({
    from: req.user.id,
    title: req.body.title,
    to: req.body.to,
    content: req.body.content
  });

  notification.save(err => {
    if (err) throw err;
    res.json({ notification });
  });
})

router.delete('/:id', adminMiddleware, (req, res) => {
  Notification.findOneAndRemove({ _id: req.params.id }, (err) => {
    if (err) throw err;
    res.json({ success: true });
  });
})

module.exports = router