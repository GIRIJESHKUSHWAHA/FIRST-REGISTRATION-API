const jwt = require("jsonwebtoken");
const registerModel = require("../model/register");

const auth = async (req, res, next) => {
    try {
        const token =  req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY );
        const user = await registerModel.findOne({_id:verifyUser._id});

        req.token = token;
        req.user = user;
        
        next();
    } catch (err) {
        res.send(`session has expire:.......${err}`);
    } 
}

module.exports = auth;