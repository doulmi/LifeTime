import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//用户
const userSchema = new Schema({
  userId: { type: String, unique: true, index: true },
  password: String,
  name: { type: String, required: true },
  sex: { type: String, enum: ['M', 'F'] },
  role: {type: ObjectId, ref: 'Role'},  //from Role collection

  isDeleted:{type: Boolean, default: false},
  
  // infos: {type: ObjectId},  //Teacher or Student Id
  birthday: Date,
  address: String, //家庭住址
  phone: String,
  
  //students' infos
  room: String,   //宿舍
  grade: String,
  class: {type: ObjectId, ref: 'Class'},  //班

  //teachers' infos
  classes: [{type: ObjectId, ref: 'Class'}]
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema);

export default User;