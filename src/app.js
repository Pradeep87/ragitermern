require("dotenv").config();
const express=require('express');
const app=express();
const path=require('path');
require("./db/coon");
const Register=require("./models/register");
const hbs=require("hbs");
const bcrypt=require('bcrypt');
const { JsonWebTokenError } = require('jsonwebtoken');
const port=process.env.PORT || 4000;

const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path))
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);




app.get('/',(req,res)=>{
    res.render("index");
 
})


app.get('/register',(req,res)=>{
    res.render("ragister");
})

app.get('/login',(req,res)=>{
    res.render("login");
})

app.post('/register', async(req,res)=>{
    try{
    const password=req.body.password;
    const cpassword=req.body.cpassword;

      if(password===cpassword){

        const registeremploy=new Register({
            fristname:req.body.fristname,
            lastname:req.body.lastname,
            email:req.body.email,
            phone:req.body.phone,
            password:password,
            Cpassword:cpassword
        })//password hashing
         //generate token
         const token= await registeremploy.generatetoken();

        const registered= await registeremploy.save();
       res.status(201).render("index"); 
   
      }else{ res.send("password not matching");
    }

       
}catch(err){
        res.status(400).send(err);
    }
 
})



app.post('/login', async (req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;
      const usermail =await Register.findOne({email:email});
        
      const ismail= await bcrypt.compare(password,usermail.password);
const token= await usermail.generatetoken();
         console.log(token);
      if(ismail){
          res.status(201).render("index");
      }else{ res.send("password is not maatching ");
    }
    } catch (err) {
        res.status(400).send(err)
    }
})




app.listen(port,()=>{

    console.log(`server is runing at port ${port} `)
})


/* hassing using bcrypt npm 
const bcrypt=require("bcrypt");

const secpass= async (passW)=>{

  const output= await bcrypt.hash(passW,10);
  console.log(output);

  const output2= await bcrypt.compare(passW,output);
  console.log(output2);

}
secpass("thapa@123");


//create  jwt token 
const jwt=require("jsonwebtoken");


const createTokan= async ()=>{

   const token= await jwt.sign({_id:"608a683d2ef3be19b45b4dc4"},"mynameispradeepkumarrajputfromrishikesh");
console.log(token);
const uservar=await jwt.verify(token,"mynameispradeepkumarrajputfromrishikesh");

console.log(uservar);
}

createTokan();



*/
