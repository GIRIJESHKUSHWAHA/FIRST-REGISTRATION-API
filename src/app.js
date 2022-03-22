require('dotenv').config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { contentType } = require("express/lib/response");

require('./databaseconnection/connection');
const registerModel = new require('./model/register');


const app = express()
const port = process.env.PORT || 7000;

const static_path = path.join(__dirname, "../public");

const template_path = path.join(__dirname, "../templates/views");

const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));

app.set("view engin", "hbs");

app.set("views", template_path);

hbs.registerPartials(partials_path);

console.log(process.env.SECRET_KEY);

app.get('/', (req, res) => {
    res.render("index.hbs");
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

            const studentsData = new registerModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                gender: req.body.gender,
                email: req.body.email,
                number: req.body.number,
                password: req.body.password
            })
            // console.log(studentsData)
            const token = await studentsData.generateAuthToken();
            console.log("this is app method1" + token);
            const register = await studentsData.save();
            // console.log("register: ", register)
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
        const isMatch = await bcrypt.compare(password, userEmail.password);

        if (isMatch) {
            const token = await userEmail.generateAuthToken();
            userEmail.save();
            res.status(201).render("index.hbs");
        } else {
            res.send("invalid login details");
        }


    } catch (err) {
        res.status(400).send({ msg: 'unable to login', error: err });
    }

})

app.get('/check-jwt', async (req, res) => {
    const data = await jwt.verify(req.headers['token'], "lkjjhg34567678lkjhgf45465678766dfghmn2345")
    return res.send({ token: data });

})
//const jwt = require("jsonwebtoken");
// const createToken = async () => {
//     const token = await jwt.sign({ _id: "62373c3587c886313221b607", name: 'xyz' }, "lkjjhg34567678lkjhgf45465678766dfghmn2345");
//     console.log(token);
// }
// createToken();

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});
