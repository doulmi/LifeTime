import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId
var deepPopulate = require('mongoose-deep-populate')(mongoose);

//课程
const courseSchema = new Schema({
  teacher: {type: ObjectId, ref: 'User'},  //授课老师
  name: String, //课程名
  desc: String, //课程描述
  grade: Number, //年级 1-4
  semester: Number, //学期 1/2
  hours : Number, //课时数
  credits: Number, //学分
  color: String
},  {
    timestamps: true
});


courseSchema.plugin(deepPopulate, {}); 

const Course = mongoose.model('Course', courseSchema);

export default Course;