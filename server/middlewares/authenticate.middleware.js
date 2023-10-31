const jwt = require("jsonwebtoken");
require("dotenv").config();


async function authenticateUser(req,res,next){
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (token == null) return res.status(401).json({message:"no token found"}); // if there isn't any token
        
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) return res.status(403).json({message:"invalid token"}); // if the token has expired or is invalid
          req.user = user.user;
          next(); // pass the execution off to whatever request the client intended
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"server error",error});
    }
}

module.exports={authenticateUser}