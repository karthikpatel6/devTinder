const express = require('express');

const app = express();

// This will only handle GET requests to /user
app.get("/user", (req,res) => {
    res.send({firstname: "karthik" , Lastname: "patel"});
});

app.post("/user", (req,res) => {
    // saving data to DB
    res.send("Data saved successfully");
});

app.delete("/user", (req,res) => {
    // deleting user from DB
    res.send("User deleted successfully");
});

// this will match all the http method API calls to /test
app.use("/test", (req,res) => {
    res.send("Hello, World! namaste duniya Testing");
});



app.listen(3000, () => {
    console.log("Server is sucessfully listening on port 3000");
});