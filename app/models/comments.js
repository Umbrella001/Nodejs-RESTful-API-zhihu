const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const commentSchema = new Schema({
    __v:{type: Number,select:false},
    content:{type: String, required: true},
    commentator:{
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
    answerId: {
        type: Schema.Types.ObjectId,
        ref: 'Answer',
        required: true,
        select: true
    },
    rootCommentId:{
        type: String,
        required: true
    },
    replyTo:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},{timestamps: true})

module.exports = model('Comment',commentSchema);