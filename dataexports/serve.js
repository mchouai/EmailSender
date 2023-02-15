const app = require('express')()

const person = {
    first_name: first_name,
    last_name: last_name,
    email: email,
    phone: phone,
    address: address,
    city: city,
    state: state,
    zip: zip,
    country: country,
    date_of_birth: date_of_birth,
    occupation: occupation,
    gender: gender
  };

app.get('/getmycard',(req,res)=>{
    res.sendFile(__dirname + "/index.html")
    person = {
        ...person,
        ...req.body
        }
console.log(person);
})

app.post('/getmycard',(req,res)=>{
    
})