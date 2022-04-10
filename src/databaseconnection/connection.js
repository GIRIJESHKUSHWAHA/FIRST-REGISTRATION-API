//comment added in from registration  branch

//this comment added in master branch
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/register-Api", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connection successfully..... "))
    .catch((err) => console.log(err));