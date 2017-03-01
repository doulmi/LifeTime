import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

/**
 * 设备
 */
const equipementSchema = new Schema({
    name: String,
    occupe: Boolean,
    count: Number
}, {
    timestamps: true
});

const Equipement = mongoose.model('Equipement', equipementSchema);

export default Equipement;