import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const tagSchema = new Schema({
    user: { type: ObjectId, ref: 'User' },
    name: String,
    color: String
}, {
    timestamps: true
});

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;