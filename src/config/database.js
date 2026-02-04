const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://karthikpatel:pdyYRKo43tRevteP@cluster0.cowo7ya.mongodb.net/devTinder"
    );
};

module.exports = connectDB;

