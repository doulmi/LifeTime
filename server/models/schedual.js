import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId
var deepPopulate = require('mongoose-deep-populate')(mongoose);

//课程表
const schedualSchema = new Schema({
  class: {type: ObjectId, ref: 'Class'},  //班级
  course: {type: ObjectId, ref: 'Course'}, //课程
  date: Date, //上课日期
  index: Number, //当天的第几节课
},  {
    timestamps: true
});


schedualSchema.plugin(deepPopulate, {}); 

const Schedual = mongoose.model('Schedual', schedualSchema);

export default Schedual;