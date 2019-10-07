const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const topicSchema = new Schema({
    __v:{type: Number, select: false},
    name: {type: String, required: true},
    introduction: {type: String, select: false},
    avatar_url:{type: String}
})

module.exports = model('Topic',topicSchema);