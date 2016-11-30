import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

//打卡表
const checkSchema = new Schema({
  course: {type: ObjectId, ref: 'Course'},
  schedual: {type: ObjectId, ref: 'Schedual'},
  student: {type: ObjectId, ref: 'User'},
  check: Boolean
},  {
    timestamps: true
});

const Check = mongoose.model('Check', checkSchema);

export default Check;