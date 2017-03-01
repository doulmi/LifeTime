import express from 'express'
import studentMiddleware from '../middlewares/studentMiddleware'
import EquipementRecord from '../models/equipementRecord'
import User from '../models/user'
import adminMiddleware from '../middlewares/adminMiddleware'

const router = express.Router()

//取得所有设备记录
router.get('/:equipementId/:limit/:page', adminMiddleware, function (req, res) {
  let user = req.user;
  let limit = Number(req.params.limit);
  let page = Number(req.params.page);

  let equipement = req.params.equipementId;

  //取得限制条件
  let equipementRecordCondition = {};

  if (equipement != undefined) {
    equipementRecordCondition['equipement'] = equipement;
  }

  EquipementRecord.count(equipementRecordCondition)
    .exec((err, count) => {
      EquipementRecord.find(equipementRecordCondition)
        .sort('-createdAt')
        .skip(limit * page)
        .limit(limit)
        .populate('user')
        .exec((err, equipementRecords) => {
          if (err) throw err;
          let total = parseInt(Math.ceil((parseFloat(count) / limit)))
          res.json({ equipementRecords, total });
        })
    });
})

//添加设备记录
router.post('/', adminMiddleware, function (req, res) {
  let user = req.user;

  let equipementRecord = new EquipementRecord(req.body);


  equipementRecord.save(err => {
    if (err) throw err;
    res.json({ equipementRecord });
  });
})

//更新设备记录
router.put('/:id', adminMiddleware, function (req, res) {
  let user = req.user;
  let condition = {};
  condition['_id'] = req.params.id;

  EquipementRecord
    .findOne(condition)
    .populate('user')
    .exec((err, equipementRecord) => {
      equipementRecord.equipement = req.body.equipement;
      equipementRecord.note = req.body.note;
      equipementRecord.start_at = req.body.start_at;
      equipementRecord.end_at = req.body.end_at;
      equipementRecord.returned = req.body.returned;
      equipementRecord.save((err) => {
        if (err) throw err;
        res.json({ equipementRecord })
      })
    })
})

router.delete('/:id', adminMiddleware, function (req, res) {
  let user = req.user;
  let condition = {};
  condition['_id'] = req.params.id;

  EquipementRecord.findOneAndRemove(condition, (err, tag) => {
    if (err) throw err;
    res.json({ success: true });
  })
})

module.exports = router