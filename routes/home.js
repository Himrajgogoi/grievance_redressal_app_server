const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const passport = require("passport");
require("dotenv").config();

const { ensureAuthenticated, isAdmin } = require("../config/authenticate");
const Issues = require("../models/Issues");

// fetching the posted issues
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
          Issues.aggregate([
            { $match: { department: user.department } },
            { $sort: { when: -1 } },
          ])
            .then((issues) => res.status(200).json({ issues: issues }))
            .catch((err) => res.status(400).json({ error: err.message }));
        }
        //admin
        else {
          Issues.find({})
            .sort({ when: -1 })
            .then((issues) => res.status(200).json({ issues: issues }))
            .catch((err) => res.status(400).json({ error: err.message }));
        }
      }
    })(req, res, next);
  } else {
    Issues.find({})
      .sort({ when: -1 })
      .then((issues) => res.status(200).json({ issues: issues }))
      .catch((err) => res.status(400).json({ error: err.message }));
  }
});

// posting new issues
router.post("/", (req, res) => {
  Issues.create(req.body)
    .then((done) => res.status(200).json({ status: "posted" }))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// rejection of issue by the resolver or deletion by the admin
router.put("/", ensureAuthenticated, (req, res) => {
  if (req.user.admin) {
    Issues.findByIdAndDelete(req.body.id)
      .then((respose) => res.status(200).json({ status: "deleted" }))
      .catch((err) => res.status(400).json({ error: err.message }));
  } else {
    const mail_content = req.body.mail_content;
    const subject = req.body.subject;
    var list_of_recipients = req.body.to_principal
      ? [req.body.email, "principaljec1960@gmail.com"]
      : [req.body.email];

    Issues.findByIdAndDelete(req.body.id)
      .then((respose) => {
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
                    <p>We have rejected your issue with the following details: </p>
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
                    <p>
                      Reason for rejection: ${mail_content}<br>
                    </p>
                    <p>
                     ${
                       req.body.to_principal
                         ? `A copy of this email has been sent to the Principal`
                         : `No copy of this email has been sent to the principal`
                     }
                    </p>
                    </div>`, // plain text body // html body
          },
          (err, info) => {
            if (err) res.status(400).json({ error: err });
            else res.status(200).json({ status: "rejected and mail sent!" });
          }
        );
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  }
});

module.exports = router;
