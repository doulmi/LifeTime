import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

/**
 * 教室
 */
const classroomSchema = new Schema({
    name: String,
}, {
    timestamps: true
});

const Classroom = mongoose.model('Classroom', classroomSchema);

export default Classroom;