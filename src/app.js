const express = require('express');

const app = express();

const { adminAuth , userAuth } = require('./middlewares/auth');

app.use("/admin", adminAuth);
app.use("/user", userAuth);

// This will only handle GET requests to /user
// app.get("/user", (req,res,next) => {
//     //res.send({firstname: "karthik" , Lastname: "patel"});
//     console.log("First callback");
//     next();
//     res.send("Response sent successfully");
// }, (req,res,next) => {
//     console.log("Second callback");
//     next();
//     res.send("Second callback");
// }, (req,res,next) => {
//     console.log("Third callback");
//     next();
//     res.send("Third callback");
// }, (req,res,next) => {
//     console.log("Fourth callback");
//     res.send("Fourth callback");
// });

// app.use("/admin", (req,res, next) => {
//     console.log("Admin middleware called");
//     const token = "xyz";
//     const isAdminAutherized = token === "xyz";
//     if(!isAdminAutherized){
//         res.status(404).send("Admin not autherized");
//     }else{
//         next();
//     }

// });

app.get("/admin/getAllData", (req,res) => {
    // Logic of checking if the request is autherized
    res.send("All data sent successfully");
});
app.get("/admin/DeleteUser", (req,res) => {
    res.send("User deleted successfully");
});


// app.post("/user", (req,res) => {
//     // saving data to DB
//     res.send("Data saved successfully");
// });

// app.delete("/user", (req,res) => {
//     // deleting user from DB
//     res.send("User deleted successfully");
// });

// // this will match all the http method API calls to /test
// app.use("/test", (req,res) => {
//     res.send("Hello, World! namaste duniya Testing");
// });



app.listen(3000, () => {
    console.log("Server is sucessfully listening on port 3000");
});