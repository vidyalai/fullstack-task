const userRouter = require("express").Router();
const { authenticateUser } = require("../middlewares/authenticate.middleware");
const { UserModel } = require("../models/user.model");
const { validateUserForRegistration, validateUserForLogin } = require("../utils/user.validate");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

userRouter.get("/",authenticateUser,async(req,res)=>{
    try {
        res.send(req.user)
    } catch (error) {
        res.status(500).json({message:"error", error})
    }
})

userRouter.post("/register",validateUserForRegistration,async(req,res)=>{
    try {
        let newUser = new UserModel(req.body);
        let output = await newUser.save();
        res.status(201).json({message:`Hi ${req.body.name}, you have registered successfully.`});
        
    } catch (error) {
        console.log(error)
    }
})

userRouter.post("/login",validateUserForLogin,async(req,res)=>{
    try {
        let isMatch = await bcrypt.compare(req.body.password, req.body.user.password);
        if(!isMatch){res.status(400).json({message:"wrong password"})}
        else {
            const token = jwt.sign({ user: req.body.user },
                                 process.env.JWT_SECRET,
                                //   { expiresIn: '24h' }
                                  );
            
            res.status(201).json({message:"logined successfully",token})}
        
    } catch (error) {
        console.log(error)
    }
})











 module.exports={userRouter}