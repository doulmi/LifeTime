import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

/**
 * 学生获得的荣誉，成就
 */
const achievementSchema = new Schema({
    user: {type: ObjectId, ref: 'User'},
    happenAt: String,   //何时获得该荣誉
    title: String,      //荣誉名称
    content: String     //荣誉的具体描述
}, {
    timestamps: true
});

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;