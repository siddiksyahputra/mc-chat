const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        require : [true, "Provide Name"]
    },
    email : {
        type : String, 
        require : [true, "Provide Email"]
    },
    password : {
        type : String, 
        require : [true, "Provide Password"]
    },
    profile_pic : {
        type : String,
        default: ""
    }
}, {
    timestamps :true
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel