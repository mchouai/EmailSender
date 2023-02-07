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