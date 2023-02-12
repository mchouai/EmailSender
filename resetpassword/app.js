const mongoose = require("mongoose")
mongoose.set('strictQuery',true)

const nodemailer = require("nodemailer")

mongoose.connect("mongodb://127.0.0.1:27017/Emailsender",{useNewUrlParser : true})

const User = require("../confirmation/app.js").User



async function password_reset(req,res,email){
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Email doesn't exist");
        }
        const token = user._id;

        // Use nodemailer to send an email with a password reset link
        // including the token as a query parameter
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
            subject: 'Password Reset',
            html: `<p>Please click on the following link to reset your password:</p>
                   <p><a href="http://localhost:3000/reset/${token}">http://localhost:3000/reset/${token}</a></p>`
        };

       await transporter.sendMail(mailOptions,  (error, info) => {
            if (error) {
                throw new Error("Failed to send password reset email");
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send("Password reset email sent");
            }
        });

    } catch (error) {
        res.status(400).send(error.message);
    }
} 

module.exports = {password_reset}