import express from 'express'
import studentMiddleware from '../middlewares/studentMiddleware'
import Equipement from '../models/equipement'
import adminMiddleware from '../middlewares/adminMiddleware'
import User from '../models/user'

const router = express.Router()

//取得所有Equipement
router.get('/:limit/:page', adminMiddleware, function (req, res) {
  let user = req.user;
  let limit = Number(req.params.limit);
  let page = Number(req.params.page);

  Equipement.count()
    .exec((err, count) => {
      Equipement.find()
        .sort('-createdAt')
        .skip(limit * page)
        .limit(limit)
        .exec((err, equipements) => {
          if (err) throw err;
          let total = parseInt(Math.ceil((parseFloat(count) / limit)))
          res.json({ equipements, total });
        });
    });
});

//返回所有设备信息
router.get('/', adminMiddleware, function (req, res) {
  Equipement.find()
    .sort('-createdAt')
    .exec((err, equipements) => {
      if (err) throw err;
      res.json({ equipements });
    });
});

//添加设备
router.post('/', adminMiddleware, function (req, res) {
  let user = req.user;

  let equipement = new Equipement(req.body);
  equipement.save(err => {
    if (err) throw err;
    res.json({ equipement });
  });
})

//更新设备
router.put('/:id', adminMiddleware, function (req, res) {
  let user = req.user;
  let condition = {};
  condition['_id'] = req.params.id;

  Equipement
    .findOne(condition)
    .exec((err, equipement) => {
      equipement.name = req.body.name;
      equipement.description = req.body.description;
      equipement.save((err) => {
        if (err) throw err;
        res.json({ equipement })
      })
    })
})

//删除设备
router.delete('/:id', adminMiddleware, function (req, res) {
  let condition = {};
  condition['_id'] = req.params.id;

  Equipement.findOneAndRemove(condition, (err, tag) => {
    if (err) throw err;
    res.json({ success: true });
  })
})

module.exports = router