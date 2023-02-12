const mongoose = require("mongoose")
mongoose.set('strictQuery',true)

const nodemailer = require("nodemailer")

mongoose.connect("mongodb://127.0.0.1:27017/Emailsender",{useNewUrlParser : true})

//define schema

const userSchema = new mongoose.Schema({
  username : {
    type : String,
    unique : true,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  confirmationToken:{
    type:"String",
    default:""
  }

})

//user module
const User = mongoose.model("User", userSchema);

