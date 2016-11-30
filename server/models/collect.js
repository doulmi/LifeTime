import mongoose from "mongoose"
var deepPopulate = require('mongoose-deep-populate')(mongoose);

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

//收集任务
const collectSchema = new Schema({
  user: {type: ObjectId, ref: 'User'},  //belongs to
  isSubmit: {type: Boolean, default: false},  //是否提交？已提交的任务将不能修改
  title: String,
  content: String,
  students: [{type: ObjectId, ref: 'User'}]
},  {
    timestamps: true
});

collectSchema.plugin(deepPopulate, {}); 

const Collect = mongoose.model('Collect', collectSchema);

export default Collect;