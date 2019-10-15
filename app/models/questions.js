const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const questionSchema = new Schema({
    __v:{type: Number,select:false},
    title:{type: String, required: true},
    description: {type: String, select: false},
    questioner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        select: false
    },
    topics: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Topic'
        }], // 也就是说可以根据id查到当前User模型中的用户信息(引用)
        select: false
    },
},{timestamps: true})

module.exports = model('Question',questionSchema);