import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

/**
 * 设备使用记录
 */
const equipementRecordSchema = new Schema({
    equipement: {type:ObjectId, ref:'Equipement'},       
    user: {type: ObjectId, ref: 'User'},
    note: String,
    start_at: Date,
    end_at: Date, 
    returned: { type: Boolean, default: false }
}, {
    timestamps: true
});

const EquipementRecord = mongoose.model('EquipementRecord', equipementRecordSchema);

export default EquipementRecord;