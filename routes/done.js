const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const passport = require("passport");
require('dotenv').config()

const { ensureAuthenticated, isAdmin } = require("../config/authenticate");

const Done = require("../models/Done")
const Accepted = require("../models/Accepted")

// fetching the done issues
router.get("/", (req, res, next) => {

    // if a user is authenticated, data is fetched according to their department
    if (req.headers.authorization) {
        passport.authenticate("jwt", { session: false }, (err, user, info) => {

            // not authenticated
            if (err) {
                res.status(400).json({ error: err.message })
            } else if (user) {
                // authenticated but not admin
                if (!user.admin) {
                    Done.aggregate([{ $match: { department: user.department } },{ $sort:{when:-1} }]).then(issues => res.status(200).json({ done: issues }))
                        .catch(err => res.status(400).json({ error: err.message }));
                }
                //admin
                else {
                    Done.find({}).sort({"when":-1}).then(issues => res.status(200).json({ done: issues }))
                        .catch(err => res.status(400).json({ error: err.message }));
                }
            }

        })(req, res, next);
    } else {
        Done.find({}).sort({"when":-1}).then(issues => res.status(200).json({ done: issues }))
            .catch(err => res.status(400).json({ error: err.message }));
    }

})

// posting the done issue
router.post("/", ensureAuthenticated, (req, res) => {

    const mail_content = req.body.mail_content;
    const subject = req.body.subject;
    const id = req.body._id;

    delete req.body.mail_content;
    delete req.body.subject;
    delete req.body._id;
    delete req.body.__v;


    Accepted.findByIdAndDelete(id).then(done => {
        Done.create(req.body).then(doc => {
            var transporter = nodemailer.createTransport({
                service:'SendinBlue',
                auth: {
                    user: "grievance.redressal.app.jec@gmail.com", 
                    pass: process.env.SENDINBLUE_PASSWORD //generated on SendInBlue
                }
            });
            transporter.sendMail({
                from: "grievance.redressal.app.jec@gmail.com", // sender address
                to: req.body.email, // list of receivers
                subject: subject, // Subject line
                html: `<div>
                <h3>Hi,</h3>
                <p>We hope you are doing well.</p>
                <p>We have completed your issue with the following details:</p>
                <p>
                Name of the griever: ${req.body.name}<br>
                Email of the griever:  ${req.body.email}<br>
                Phone number: ${req.body.phone}<br>
                Description of the issue: ${req.body.description}<br>
                Jurisdiction Department: <strong>${req.body.department_name}</strong><br>
                Location: ${req.body.where}<br>
                Posted on: ${req.body.when}<br>
               </p>
                <p>Completion details: ${mail_content}<br>
                Time of completion: ${req.body.time_of_completion}<br>
                </p></div>` // plain text body // html body
            }, (err, info) => {
                if (err) res.status(400).json({ error: err });
                else res.status(200).json({ status: "task completed and mail sent!" })
            });
        }).catch(err => res.status(400).json({ error: err }))
    }).catch(err => res.status(400).json({ error: err }))

})

// deleting of issue by admin
router.put("/", ensureAuthenticated, isAdmin, (req, res) => {
    Done.findByIdAndDelete(req.body.id).then(respose => res.status(200).json({ status: "deleted" }))
        .catch(err => res.status(400).json({ error: err.message }));
})




module.exports = router;