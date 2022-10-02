const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const passport = require("passport");
require("dotenv").config();

const { ensureAuthenticated, isAdmin } = require("../config/authenticate");

const Accepted = require("../models/Accepted");
const Issues = require("../models/Issues");

// fetching the accepted issues
router.get("/", (req, res, next) => {
  // if a user is authenticated, data is fetched according to their department
  if (req.headers.authorization) {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      // not authenticated
      if (err) {
        res.status(400).json({ error: err.message });
      } else if (user) {
        // authenticated but not admin
        if (!user.admin) {
          Accepted.aggregate([
            { $match: { department: user.department } },
            { $sort: { when: -1 } },
          ])
            .then((issues) => res.status(200).json({ accepted: issues }))
            .catch((err) => res.status(400).json({ error: err.message }));
        }
        //admin
        else {
          Accepted.find({})
            .sort({ when: -1 })
            .then((issues) => res.status(200).json({ accepted: issues }))
            .catch((err) => res.status(400).json({ error: err.message }));
        }
      }
    })(req, res, next);
  } else {
    Accepted.find({})
      .sort({ when: -1 })
      .then((issues) => res.status(200).json({ accepted: issues }))
      .catch((err) => res.status(400).json({ error: err.message }));
  }
});

// posting the accepted issue
router.post("/", ensureAuthenticated, (req, res) => {
  const mail_content = req.body.mail_content;
  const subject = req.body.subject;
  const id = req.body._id;
  const to_principal = req.body.to_principal;
  var list_of_recipients = req.body.to_principal
    ? [req.body.email, "principaljec1960@gmail.com"]
    : [req.body.email];

  delete req.body.mail_content;
  delete req.body.subject;
  delete req.body._id;
  delete req.body.__v;
  delete req.body.to_principal;

  Issues.findByIdAndDelete(id)
    .then((done) => {
      Accepted.create(req.body)
        .then((doc) => {
          var transporter = nodemailer.createTransport({
            service: "SendinBlue",
            auth: {
              user: "grievance.redressal.app.jec@gmail.com",
              pass: process.env.SENDINBLUE_PASSWORD, //generated on SendInBlue
            },
          });
          transporter.sendMail(
            {
              from: "grievance.redressal.app.jec@gmail.com", // sender address
              to: list_of_recipients, // list of receivers
              subject: subject, // Subject line
              html: `<div>
                <h3>Hi,</h3>
                <p>We hope you are doing well.</p>
                <p>We have accepted your issue and the details are:</p>
                <p>
                Name of the griever: ${req.body.name}<br>
                Email of the griever:  ${req.body.email}<br>
                Phone number: ${req.body.phone}<br>
                Description of the issue: ${req.body.description}<br>
                Jurisdiction Department: <strong>${
                  req.body.department_name
                }</strong><br>
                Location: ${req.body.where}<br>
                Posted on: ${req.body.when}<br>
               </p>
                <p>Acceptance description: ${mail_content} <br>
                Estimated time of completion: ${req.body.estimated_time}<br>
                </p>
                <p>
                ${
                  to_principal
                    ? `A copy of this email has been sent to the Principal`
                    : `No copy of this email has been sent to the Principal`
                }
               </p>
                </div>`, // plain text body // html body
            },
            (err, info) => {
              if (err) res.status(400).json({ error: err });
              else res.status(200).json({ status: "accepted and mail sent!" });
            }
          );
        })
        .catch((err) => res.status(400).json({ error: err }));
    })
    .catch((err) => res.status(400).json({ error: err }));
});

// deleting of issue by admin
router.put("/", ensureAuthenticated, isAdmin, (req, res) => {
  Accepted.findByIdAndDelete(req.body.id)
    .then((respose) => res.status(200).json({ status: "deleted" }))
    .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = router;
