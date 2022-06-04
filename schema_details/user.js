require('dotenv').config()
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    rollnum: { type: Number, required: true, unique: true },
    mobileNumber: { type: String, required: true, maxlength: 10, minlength: 10, unique: true },
    password: { type: String, minlength: 8 },
    year: { type: Number, required: true, min: 1, max: 4 },
    branch: { type: String, required: true },
    gender: { type: String, required: true },
    is_admin: { type: Number, default:0 },
    otp_val: { type: Number },
});

// token generate---------
UserSchema.methods.generateAuthToken = async function(){
  try {
    const pay_load = {_id:this._id};
    const token = jwt.sign(pay_load, process.env.TOKEN_SECRET_KEY); 
    // console.log(token);
    const token_verify = jwt.verify(token,process.env.TOKEN_SECRET_KEY);
    const token_obj={
      id:token_verify,
      token:token
    }
    return token_obj;
  } catch (err) {
    res.status(400).send(err);
  }
}

// passwaord incryption------------
UserSchema.pre("save", async function(next){
    if(this.isModified("password")){
      this.password= await bcrypt.hash(this.password,saltRounds);
    }
    next();
  })

const User = new mongoose.model("User",UserSchema);
module.exports = User;
