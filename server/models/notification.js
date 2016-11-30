import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

/**
 * 公告
 */
const notificationSchema = new Schema({
  from: { type: ObjectId, ref: 'User' },  //哪个老师所发
  to: String,
  title: String,  //公告名称
  content: String //公告内容
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
