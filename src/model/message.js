require("../databaseconnection/connection");
const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    message:{
        type:String,
        required:true
    },
    Date:{
        type:Date,
        default:Date()
    }
})

const messageModel = new mongoose.model('messageModel',messageSchema)
module.exports= messageModel;