require('dotenv').config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")
const auth = require("./databaseconnection/auth");

// this is new comment added in new branch registraction-module
//const cors = require('cors');
//const { contentType, cookie } = require("express/lib/response");

require('./databaseconnection/connection');
const registerModel = new require('./model/register');
const app = express()

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));

//app.use(cors())
const port = process.env.PORT || 3000;
app.set("view engin", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get('/', (req, res) => {
    res.render("index.hbs");
});

app.get("/secret", auth, (req, res) => {
    res.render("secret.hbs");
});

app.get("/register", (req, res) => {
    res.render("register.hbs");
})

app.get("/login", (req, res) => {
    res.render("login.hbs");
})

app.post("/register", async (req, res) => {
   
    try {
        const password = req.body.password;
        const rePassword = req.body.rePassword;

        if (password === rePassword) {
            const bcryptPass = await bcrypt.hash(req.body.password, 10);
            const studentsData = new registerModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                gender: req.body.gender,
                email: req.body.email,
                number: req.body.number,
                password: bcryptPass
              
            })
            
            const token = await studentsData.generateAuthToken();
            
            // res.cookie() method is use to set the cookies
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 3000),
                httpOnly: true,
                //secure: true
            });
            const register = await studentsData.save();
            res.status(201).render("index.hbs");

        } else {
            res.send("password are not matched....")
        }
    } catch (err) {
        res.status(400).send({ msg: 'unable to register', error: err });
    }
})
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userEmail = await registerModel.findOne({ email: email });

        if (!userEmail) {
            res.send("invalid login details");
        }
        const isMatch = await bcrypt.compare(password, userEmail.password);

        if (isMatch) {
            const token = await userEmail.generateAuthToken();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 100000),
                httpOnly: true,
                secure: true
            });
            res.status(201).render("index.hbs");
        }
        else {
            res.send("invalid login details");
        }
    } catch (err) {
        res.status(400).send({ msg: 'unable to login12', error: err });
    }

})
app.get('/logout', auth, async (req, res) => {
    try {
        //log out from single device
        req.user.tokens = req.user.tokens.filter((currentElement) => {
            return currentElement.token != req.token;
        })

        //log out from all devices
        //req.user.token=[];
        res.clearCookie("jwt");

        await req.user.save();
        res.render("login.hbs");
    } catch (error) {
        res.status(500).send();
    }
});

app.get('/check-jwt', async (req, res) => {
    const data = await jwt.verify(req.headers['token'], process.env.SECRET_KEY)
    return res.send({ token: data });

})


app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});
