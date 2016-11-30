import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

//班级
const classSchema = new Schema({
  grade: String, //年级
  name: String, //班级
}, {
    timestamps: true
});

const Class = mongoose.model('Class', classSchema);

export default Class;