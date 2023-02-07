const nodemailer = require ("nodemailer")

const transporter = nodemailer.createTransport({
 service : "gmail",
    auth : {
        user : "chazermed65@gmail.com",
        pass : "qpbsoholbhpiowhn",
    }
})

const options = {
    from : "chazermed65@gmail.com",
    to : "",
    subject : "automatique mail sender",
    text : "Hey dear!\n  In attachement you find the document \n \n Thank you for your interest",
    attachments :  [{
        filename  : "Document.pdf",
        path  : __dirname + "/Document.pdf"
    }]
}




module.exports = {options , transporter}