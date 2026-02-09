const express = require('express');
const connectDB = require('./config/database'); // Ensure database is connected
const app = express();
const User = require('./models/user');
const validateSignUpData  = require('./utils/validation');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');


const bcrypt = require('bcrypt');

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser());

app.post("/signup", async (req,res) => {
    // console.log("Request body:", req.body); // Log the request body to see what data is being sent


    // const userObj = {
    //     firstName: "Karthik",
    //     lastName: "Patel",
    //     emailId: "karthik.patel@example.com",
    //     password: "karthik@123"
    // } 
    // // Creating a new instance of the User model
    // const user = new User(userObj);
    // or
    // const user = new User({
    //     firstName: "Virat",
    //     lastName: "Kohli",
    //     emailId: "virat.kohli@example.com",
    //     password: "virat@123",
    //     age: 35,
    //     gender: "Male"
    // });
    // or

    try {
    // validate the data
    console.log("before validation");
    validateSignUpData(req);
    console.log("after validation");

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

app.post("/login", async (req,res) => {
    try{
        const { emailId,password} = req.body;
        
        const user = await User.findOne({ emailId: emailId });
        if(!user){
            throw new Error("User not found");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){

            // Create a JWT Token
            const token = await user.getjwt();

            // Add the token to cookie and send the response back to the user
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8*360000),
            });

            res.send("Login successful");
        }else{
            throw new Error("Invalid password");
        }
    }catch(err){
        res.status(400).send("Error logging in : " + err.message);
    }
});

app.get("/profile", async (req,res) => {
    try{
        // const cookies = req.cookies;
        // const { token } = cookies;
        // // Validate the token
        // if(!token){
        //     throw new Error("Token is not valid");
        // }
        // const decodedMessage = await jwt.verify(token, "DevTinder$676");
        // console.log("Decoded JWT token:", decodedMessage);
        // const { _id } = decodedMessage;
        // console.log("User ID from decoded token:", _id);
        const user = req.user;
        res.send(user);

    }catch(err){
        res.status(400).send("Error fetching profile : " + err.message);
    }
})

app.post("/sendConnectionRequest",userAuth, async (req,res) => {
    const user = req.user;
    console.log("Sending connection request");

    res.send(user.firstName + " sent a connection request");
})

// GET user by email API
app.get("/user", async (req,res) => {
    const userEmail = req.body.emailId;
    try{
        const user = await User.find({emailId: userEmail});
        if(user.length === 0){
            res.status(404).send("User not found");
        }
        res.send(user);
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});

// FeedAPI  - GET /feed - get all the users from the database
app.get("/feed", async (req,res) => {
    try{
        const users = await User.find();
        res.send(users);
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});

app.delete("/user", async (req,res) => {
    const userId = req.body.userId;
    try{
        // const user = await User.findByIdAndDelete(_id = userId);
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});

app.patch("/user", async (req,res) => {
    const userId = req.body.userId;
    const data = req.body;
    try{
        await User.findByIdAndUpdate(userId,data , {
            returnDocument: "after",
            runValidators: true
        });
        res.send("User updated successfully");
    }catch(err){
        res.status(400).send("UPDATE FAILED:" + err.message);
    }
})

connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log("Server is successfully listening on port 3000");
    });
}).catch((err) => {
    console.error("Database connection failed", err);
});

// const { adminAuth , userAuth } = require('./middlewares/auth');

// app.use("/admin", adminAuth);
// app.use("/user", userAuth);

// // This will only handle GET requests to /user
// // app.get("/user", (req,res,next) => {
// //     //res.send({firstname: "karthik" , Lastname: "patel"});
// //     console.log("First callback");
// //     next();
// //     res.send("Response sent successfully");
// // }, (req,res,next) => {
// //     console.log("Second callback");
// //     next();
// //     res.send("Second callback");
// // }, (req,res,next) => {
// //     console.log("Third callback");
// //     next();
// //     res.send("Third callback");
// // }, (req,res,next) => {
// //     console.log("Fourth callback");
// //     res.send("Fourth callback");
// // });

// // app.use("/admin", (req,res, next) => {
// //     console.log("Admin middleware called");
// //     const token = "xyz";
// //     const isAdminAutherized = token === "xyz";
// //     if(!isAdminAutherized){
// //         res.status(404).send("Admin not autherized");
// //     }else{
// //         next();
// //     }

// // });

// app.get("/admin/getAllData", (req,res) => {
//     // Logic of checking if the request is autherized
//     res.send("All data sent successfully");
// });
// app.get("/admin/DeleteUser", (req,res) => {
//     res.send("User deleted successfully");
// });


// // app.post("/user", (req,res) => {
// //     // saving data to DB
// //     res.send("Data saved successfully");
// // });

// // app.delete("/user", (req,res) => {
// //     // deleting user from DB
// //     res.send("User deleted successfully");
// // });

// // // this will match all the http method API calls to /test
// // app.use("/test", (req,res) => {
// //     res.send("Hello, World! namaste duniya Testing");
// // });