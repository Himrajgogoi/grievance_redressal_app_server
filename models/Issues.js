const mongoose = require("mongoose");

const IssuesSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    department: {
        type: Number,
        required: true
    },
    department_name:{
        type: String,
        required: true
    },
    where: {
        type: String,
        required: true
    },
    when: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: true
    },
    availability_time: {
        type: String,
    },
    image: {
        type: String,
    }
}, { strict: false });

module.exports = Issues = mongoose.model("issues", IssuesSchema);