import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

/**
 * 学生获得助学金
 */
const aideSchema = new Schema({
    user: {type: ObjectId, ref: 'User'},
    happenAt: String,   //何时获得该助学金
    count: Number   //获得的金额
}, {
    timestamps: true
});

const Aide = mongoose.model('Aide', aideSchema);

export default Aide;