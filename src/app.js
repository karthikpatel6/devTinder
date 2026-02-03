const express = require('express');

const app = express();

app.use("/test", (req,res) => {
    res.send("Hello, World! namaste duniya");
});

app.listen(3000, () => {
    console.log("Server is sucessfully listening on port 3000");
});