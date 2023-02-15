const express = require('express');
const app = express();

const bodyparser = require("body-parser")
app.use(bodyparser.urlencoded({extended:false}))

//send a PDF document to the given email
const mail = require("./basic/app.js")



const options = mail.options;

app.get('/', (req, res) => {
  res.sendFile( __dirname + '/basic/index.html');
});

app.post('/',(req,res)=>{
      options.to = req.body.eemail;
      mail.transporter.sendMail(options, function(err,info){
        if(err){
          console.log(err);
          return;
      }
  console.log("sent : " + info.response);
})
res.send(`<script>
  alert('Document sent to : ${options.to}');
</script>`)

})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


//Create User with mail confirmation

const confirmation = require("./confirmation/app.js")

app.get("/signup",(req, res) => {
  res.sendFile( __dirname + '/confirmation/index.html');
});

app.post("/signup",(req,res)=>{
  
      confirmation.createUser(req , res, req.body.username, req.body.password, req.body.email)
 
})

app.get("/confirm/:confirmationToken", async (req, res) => {
  try {
    const user = await confirmation.User.findOne({ confirmationToken: req.params.confirmationToken });
    if (!user) {
      throw new Error("Invalid confirmation token");
    }
    user.confirmed = true;
    user.confirmationToken = undefined;
    await user.save();
    res.send("Email confirmed successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
  
});

//password reset

const reset = require("./resetpassword/app.js")
app.get("/password",(req,res)=>{
  res.sendFile( __dirname + '/resetpassword/index.html');
})

app.post("/password",(req,res)=>{
  
  reset.password_reset(req , res,req.body.email)

})

app.get("/reset/:Token",(req,res)=>{
  res.sendFile( __dirname  + '/resetpassword/reset.html')
})
app.post("/reset/:Token", async (req, res) => {
  try {
    const user = await confirmation.User.findOne({ id: req.params.Token });
    if (!user) {
      throw new Error("Invalid confirmation token");
    }
    user.password = req.body.password ;
    
    await user.save();
    res.send("Password changed successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
  
});

//data extraction

const { create_form } = require("./dataexports/data_app.js")
const { generate_pdf } = require("./dataexports/pdf_generate.js")

let person = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  date_of_birth: '',
  occupation: '',
  gender: ''
};

app.get('/addperson',(req,res)=>{
  
  res.sendFile(__dirname + "/dataexports/index.html")

})

app.post('/addperson',(req,res)=>{
  person = {
    ...person,
    ...req.body
    };
create_form(person);
generate_pdf(person);

const options = {
  from : "chazermed65@gmail.com",
  to : person.email,
  subject : "automatic generated card",
  text : `Hey ${person.first_name}!\n  In attachement you find your card \n \n Thank you!!`,
  attachments :  [{
      filename  : "card.pdf",
      path  : __dirname + "/card.pdf"
  }]
}

mail.transporter.sendMail(options, function(err,info){
  if(err){
    console.log(err);
    return;
}


console.log("sent : " + info.response);
})
res.send("<h2> Your card created succefuly and sent to your email </h2> ")
})

