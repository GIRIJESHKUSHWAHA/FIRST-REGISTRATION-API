
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");

require("../databaseconnection/connection");

const registerSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "this id is all ready present"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("email is invalid.....");
            }
        }
    },
    number: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})
//generating jason web token(jwt) 
registerSchema.methods.generateAuthToken = async function () {
    try {
        
        const token = await jwt.sign({ _id: this._id.toString() },process.env.SECRET_KEY);
        console.log(token);
        this.tokens = this.tokens.concat({ token: token })
        await this.save();

        return token;
    } catch (error) {
        res.send("registration field " + error);
    }

}

const registerModel = new mongoose.model("studentsData", registerSchema);

module.exports = registerModel;

