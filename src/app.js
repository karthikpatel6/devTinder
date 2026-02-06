const express = require('express');
const connectDB = require('./config/database'); // Ensure database is connected
const app = express();
const User = require('./models/user');

app.use(express.json()); // Middleware to parse JSON request bodies
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
    const user = new User(req.body);



    try {
        await user.save();
        res.send("User created successfully");
    } catch (err) {
        res.status(400).send("Error creating user");
    }
});

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