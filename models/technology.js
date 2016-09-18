var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var TechnologySchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
});

exports.TechnologySchema = TechnologySchema;
module.exports = mongoose.model('Technology', TechnologySchema);