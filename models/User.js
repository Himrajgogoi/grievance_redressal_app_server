const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true

    },
    department: {
        type: Number,
        required: true
    },
    password: {
        type: String

    },
    date: {
        type: Date,
        default: Date.now
    },
}, { strict: false });

module.exports = User = mongoose.model("users", UserSchema);