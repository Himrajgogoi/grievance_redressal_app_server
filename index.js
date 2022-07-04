const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
require('dotenv').config();

const passport = require("./passport/setup");
const auth = require("./routes/auth");
const home = require("./routes/home");
const app = express();
const port = 5000;

// Mongo DB cluster URL
const MONGO_URI = process.env.MONGO_URI;

// Connecting to Mongo DB
mongoose.connect(MONGO_URI)
    .then(console.log("successfully connected!"))
    .catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitilized: true,
        store: new MongoStore({ mongoUrl: MONGO_URI })
    })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/api/auth", auth);
app.use("/api", home);

app.listen(port, () => {
    console.log(
        "Listening:", port
    );
})