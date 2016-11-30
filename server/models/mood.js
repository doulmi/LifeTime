import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

/**
 * 学生的身心健康
 */
const moodSchema = new Schema({
    user: {type: ObjectId, ref: 'User'},
    slug: String,   //根据学生的心情给予6种形式：非常开心，开心，一般般，不开心，很不开心，愤怒
    color: String,  //每种心情对应一种颜色
    text: String    //描述性文字
}, {
    timestamps: true
});

const Mood = mongoose.model('Mood', moodSchema);

export default Mood;