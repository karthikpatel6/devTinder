const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type : String,
        required : true,
        minLength : 4,
        maxLength : 50
    },
    lastName: {
        type : String
    },
    emailId : {
        type : String,
        lowercase : true,
        required : true,
        unique : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email ID :" + value);
            }
        }
    },
    password : {
        type : String,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Weak Password :" + value);
            }
        }
    },
    age : {
        type : Number,
        min : 18,
        max : 70
    },
    gender : {
        type : String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender is not valid");
            }
        }
    },
    photoUrl : {
        type : String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL :" + value);
            }
        }
    },
    about : {
        type : String,
        default : "Hey there! I am using DevTinder."
    },
    skills : {
        type : [String]
    }

}, {timestamps : true});

// const userModel = mongoose.model("User", userSchema);
// module.exports = userModel;
// or
module.exports = mongoose.model("User", userSchema);

