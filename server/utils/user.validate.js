const { UserModel } = require("../models/user.model");

async function validateUserForLogin(req,res,next){
    let {email, password}=req.body;
    if(!email){res.status(400).json({message:"please enter your email"})}
    else if(!isValidEmail(email) ){res.status(400).json({message:"please enter a valid email "})}
    else if(!password ){res.status(400).json({message:"please enter your password "})}
    else {
        let userExists = await UserModel.findOne({email}).select('+password');
        if(!userExists){res.status(404).json({message:"No user found with this email, please register "})}
        else {
            console.log(userExists)
            req.body.user=userExists;
            next()}
        }

}
async function validateUserForRegistration(req,res,next){
    let {name, email, password,cPassword}=req.body;
    if(!name){res.status(400).json({message:"please enter your name"})}
    else if(!email){res.status(400).json({message:"please enter your email"})}
    else if(!isValidEmail(email) ){res.status(400).json({message:"please enter a valid email "})}
    else if(!password ){res.status(400).json({message:"please enter a password "})}
    else if(!cPassword ){res.status(400).json({message:"please confirm your password"})}
    else if(password.length<5 ){res.status(400).json({message:"please enter a strong password "})}
    else if(password!=cPassword ){res.status(400).json({message:"password's doesn't match"})}
    else {
        let userExists = await UserModel.findOne({email});
        if(userExists){res.status(409).json({message:"This email is already registered with us, please login "})}
        else {next()}
        }

}








function isValidEmail(email) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }



  module.exports={ validateUserForRegistration,validateUserForLogin}