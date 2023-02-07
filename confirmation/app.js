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


//create user
async function createUser(req,res,username,password,email) {
  try {
    const existingUsername = await User.findOne({ username });
    const existingemail = await User.findOne({ email });
    if (existingUsername) {
      throw new Error("Username already exist");
    }
    if (existingemail) {
      throw new Error("Email already exist");
    }
    const user = new User({ username, email, password });
    await user.save();

    //prepare confirmation token ( to make it simple we used the user id generated automaticlly by mongodb instead of using JWT )

    const confirmationToken = user._id;
    user.confirmationToken = confirmationToken;
    await user.save();
    await sendConfirmationEmail(user, confirmationToken);
    return res.status(200).send("User created successfully. Check your email to confirme your account" );
  
  } catch (error) {
    return res.status(400).send( error.message );
  }
  }


  //prepare the confirmation email
  async function sendConfirmationEmail(user,confirmationToken) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user : "chazermed65@gmail.com",
        pass : "qpbsoholbhpiowhn",
      }
    });
    const mailOptions = {
      from: "chazermed65@gmail.com",
      to: user.email,
      subject: "Confirm your email",
      html: ` Hello "${user.username}" <br>
      Click here to confirme your email : 
      <a href="http://localhost:3000/confirm/${confirmationToken}">Confirm your email</a>`
    };
    await transporter.sendMail(mailOptions);
  }
  
  
  


  module.exports = {User , createUser, sendConfirmationEmail}