const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
    __v:{type:Number, select: false},
    name:{type: String, required: true},
    password:{type: String, required: true,select:false},
    avatar_url:{type: String, required: false},
    gender:{type: String, enum:['male','female'],default:'male',required: true},
    headline:{type: String},
    locations:{type: [{ type:String }],select:false},
    business: {type:String},
    employments: { type: [{
        company: { type: String },
        job: { type: String }
    }],select:false},
    educations: {
        type: [{
          school: { type: String },
          major: { type: String },
          diploma: { type: Number, enum:[1,2,3,4,5]},
          entrance_years: { type: Number },
          graduation_years: { type: Number }  
        }],select:false
    },
    test:{type:[{type: String}],select:false},
    following: {
        type:[{ type:Schema.Types.ObjectId, ref: 'User' }], // 也就是说可以根据id查到当前User模型中的用户信息(引用)
        select: false
    }
})

module.exports = model('User',userSchema);