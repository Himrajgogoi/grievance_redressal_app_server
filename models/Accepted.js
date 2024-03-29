const mongoose = require("mongoose");

// defining the schema for the accepted grievances
const AcceptedSchema = mongoose.Schema({

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
    estimated_time: {
        type: Date,
        required: true
    },
    image: {
        type: String,
    }
}, { strict: false });

module.exports = Accepted = mongoose.model("accepted", AcceptedSchema);