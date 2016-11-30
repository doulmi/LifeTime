import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const taskSchema = new Schema({
    user: {type: ObjectId, ref: 'User'},
    created_at: Date, 
    date: String,
    stopAt: String, 
    startAt: String, 
    duration: Number,
    tag: {type: ObjectId, ref: 'Tag'},
    text: String
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;