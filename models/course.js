var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CourseSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
     technologyType: {
        type: String,
        required: true,
        trim: true
    }
});

exports.CourseSchema = CourseSchema;
module.exports = mongoose.model('Course', CourseSchema);