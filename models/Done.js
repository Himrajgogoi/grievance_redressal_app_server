const mongoose = require("mongoose");

const DoneSchema = mongoose.Schema({

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
    estimated_time: {
        type: Date,
        required: true
    },
    image: {
        type: String,
    }
}, { strict: false });

module.exports = Done = mongoose.model("done", DoneSchema);