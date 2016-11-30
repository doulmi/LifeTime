import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

/**
 * 学生的视力
 */
const optiqueSchema = new Schema({
    user: {type: ObjectId, ref: 'User'},
    date : String,
    left : String,
    right: String
}, {
    timestamps: true
});

const Optique = mongoose.model('Optique', optiqueSchema);

export default Optique;