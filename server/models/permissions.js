import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const permissionSchema = new Schema({
    name: String,
    slug: String
}, {
    timestamps: true
});

const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;