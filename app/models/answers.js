const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const answerSchema = new Schema({
    __v:{type: Number,select:false},
    content:{type: String, required: true},
    answerer:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        select: false
    },
    questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
        select: true
    },
    praise:{
        type: Number,
        required: true,
        default: 0
    },
    oppose:{
        type: Number,
        required: true,
        default: 0 
    }
})

module.exports = model('Answer',answerSchema);