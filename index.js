const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyparser = require("body-parser");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
require('dotenv').config();

const passport = require("./passport/setup");
const auth = require("./routes/auth");
const home = require("./routes/home");
const accepted = require("./routes/accepted");
const done = require("./routes/done");

const app = express();
const port = process.env.PORT || 5000;

// Mongo DB cluster URL
const MONGO_URI = process.env.MONGO_URI;

// Connecting to Mongo DB
mongoose.connect(MONGO_URI)
    .then(console.log("successfully connected!"))
    .catch(err => console.log(err));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// // Express Session
// app.use(
//     session({
//         secret: process.env.SESSION,
//         resave: false,
//         saveUninitilized: false,
//         store: new MongoStore({ mongoUrl: MONGO_URI })
//     })
// );

// passport middleware
app.use(passport.initialize());
//app.use(passport.session());



// routes
app.use("/api/auth", auth);
app.use("/api/main", home);
app.use("/api/accepted", accepted);
app.use("/api/done", done);

app.listen(port, () => {
    console.log(
        "Listening:", port
    );
})