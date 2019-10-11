const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;

const userSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    avatar_url: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male',
        required: true
    },
    headline: {
        type: String
    },
    locations: {
        type: [{
            type: Schema.Types.ObjectId,
            ref:'Topic'
        }],
        select: false
    },
    business: {
        type: Schema.Types.ObjectId,
        ref:'Topic',
        select: false
    },
    employments: {
        type: [{
            company: {
                type: Schema.Types.ObjectId,
                ref:'Topic'
            },
            job: {
                type: Schema.Types.ObjectId,
                ref:'Topic'
            }
        }],
        select: false
    },
    educations: {
        type: [{
            school: {
                type: Schema.Types.ObjectId,
                ref:'Topic'
            },
            major: {
                type: Schema.Types.ObjectId,
                ref:'Topic'
            },
            diploma: {
                type: Number,
                enum: [1, 2, 3, 4, 5]
            },
            entrance_years: {
                type: Number
            },
            graduation_years: {
                type: Number
            }
        }],
        select: false
    },
    test: {
        type: [{
            type: String
        }],
        select: false
    },
    following: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }], // 也就是说可以根据id查到当前User模型中的用户信息(引用)
        select: false
    },
    followingTopics:{
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Topic'
        }],
        select: false
    },
    listLikingAnswers:{
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Answer'
        }],
        select: false
    },
    listDisLikingAnswers:{
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Answer'
        }],
        select: false
    },
    listCollectAnswers:{
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Answer'
        }],
        select: false
    }
})

module.exports = model('User', userSchema);