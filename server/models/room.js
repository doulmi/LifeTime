import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const roomSchema = new Schema({
    name: {type: String, required: true},
});

const Room = mongoose.model('Room', roomSchema);

export default Room;