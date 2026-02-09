const jwt = require('jsonwebtoken');
const User = require('../models/user');


// const adminAuth = (req,res,next) => {
//     console.log("Admin auth is getting checked");
//     const token = "xyz";
//     const isAdminAutherized = token === "xyz";
//     if(!isAdminAutherized){
//         res.status(404).send("Admin not autherized");
//     }else{
//         next();
//     }
// };
// const userAuth = (req,res,next) => {
//     console.log("User auth is getting checked");
//     const token = "xyz";
//     const isAdminAutherized = token === "xyz";
//     if(!isAdminAutherized){
//         res.status(404).send("User not autherized");
//     }else{
//         next();
//     }
// };

const userAuth = async (req,res,next) => {
    try{
        const { token } = req.cookies;
        if(!token){
            throw new Error("Token is not valid");
        }
        const decodedMessage = await jwt.verify(token, "DevTinder$676");

        const { _id } = decodedMessage;

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }catch(err){
        res.status(400).send("Error authenticating user : " + err.message);
    }
}


module.exports = { userAuth };