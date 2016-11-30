import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

//分数
const scoreSchema = new Schema({
  student: {type: ObjectId, ref: 'User'},
  course: {type: ObjectId, ref: 'Course'}, //课程
  semester: Number,
  note: Number
},  {
    timestamps: true
});

const Score = mongoose.model('Score', scoreSchema);

export default Score;