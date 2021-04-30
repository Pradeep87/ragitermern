const mongoose=require('mongoose');
const jwt=require("jsonwebtoken");

const bcrypt=require("bcrypt");
const employSchema=new mongoose.Schema({

    fristname:{
        type:String,
        required:true,

    },
    lastname:{
        type:String,
        required:true,

    }, email:{
        type:String,
        required:true,
        unique:true,

    },
    phone:{
        type:Number,
        required:true,

    },
    password:{
        type:String,
        required:true,

    },
    Cpassword:{
        type:String,
        required:true,

    },
    tokens:[{
        token:{  type:String,
            required:true,
    }
    }]
    

});
// gnerate token 

employSchema.methods.generatetoken=async function (){

    try {
        const token=jwt.sign({_id:this._id.toString()},"mynameispradeepawebdevloper");
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;

    } catch (error) {
        res.send(error);console.log(error);
    }
}

//hashing
employSchema.pre("save", async function (next){

    if(this.isModified("password")){
     console.log(`password is ${this.password}`);
      this.password=await bcrypt.hash(this.password,10);    
      this.Cpassword=await bcrypt.hash(this.Cpassword,10);    
   
    }
    next();
 })

const Register =new mongoose.model('Register',employSchema);

module.exports=Register;