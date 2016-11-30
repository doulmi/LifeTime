import mongoose from "mongoose"
var deepPopulate = require('mongoose-deep-populate')(mongoose);

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const roleSchema = new Schema({
    name: {type: String, required: true},
    slug: {type: String, required: true, unique: true, index: true},
    permissions: [{type: String, slug: String}] //Permission ID
});

roleSchema.plugin(deepPopulate, {}); 

const Role = mongoose.model('Role', roleSchema);

export default Role;