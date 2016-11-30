import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const punishmentSchema = new Schema({
    user: {type: ObjectId, ref: 'User'},
    happenAt: String,
    title: String,
    content: String
}, {
    timestamps: true
});

const Punishment = mongoose.model('Punishment', punishmentSchema);

export default Punishment;