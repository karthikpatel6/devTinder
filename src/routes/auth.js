const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req,res) => {
    try { 
    // validate the data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //Creating a new instance of the User model using the request body
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
    });

        await user.save();
        res.send("User created successfully");
    } catch (err) {
        res.status(400).send("Error creating user : " + err.message);
    }
});

authRouter.post("/login", async (req,res) => {
    try{
        const { emailId,password} = req.body;
        
        const user = await User.findOne({ emailId: emailId });
        if(!user){
            throw new Error("User not found");
        }

        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            // Create a JWT Token
            const token = await user.getJWT();

            // Add the token to cookie and send the response back to the user
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8*360000),
            });

            res.send("Login successful");
        }else{
            throw new Error("Invalid password");
        }
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

authRouter.post("/logout", (req,res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout successful");
});

module.exports = authRouter;