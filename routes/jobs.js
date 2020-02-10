const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

//Load Idea Model
require("../models/Job");
const Job = mongoose.model("jobs");

//Job index page
router.get("/", ensureAuthenticated, (req, res) => {
  Job.find({User: req.user.id})
    .sort({ date: "desc" })
    .then(jobs => {
      res.render("jobs/index", {
        jobs: jobs
      });
    });
});

//Add Idea Form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("jobs/add");
});

//Edit Idea Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Job.findOne({
    _id: req.params.id
  }).then(job => {
    if(job.User != req.user.id){
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/jobs');
    }
    else{
      res.render("jobs/edit", {
        id: job._id,
        company: job.company,
        location: job.location,
        job_title: job.job_title,
        status: job.status,
        details: job.details,
        link: job.link
      });
    }
  });
});

//Process form
router.post("/add", ensureAuthenticated, (req, res) => {
  let errors = [];
  if (!req.body.company) {
    errors.push({ text: "Please add a company" });
  }
  if (!req.body.job_title) {
    errors.push({ text: "Please enter a job title" });
  }
  if (!req.body.location) {
    errors.push({ text: "Please enter a location" });
  }
  if (errors.length > 0) {
    res.render("jobs/add", {
      errors: errors,
      company: req.body.company,
      job_title: req.body.job_title,
      location: req.body.location,
      details: req.body.details,
      link: req.body.link
    });
  } else {
    const newUser = {
      company: req.body.company,
      location: req.body.location,
      job_title: req.body.job_title,
      status: "In Progress",
      details: req.body.details,
      link: req.body.link,
      User: req.user.id
    };
    new Job(newUser)
      .save()
      .then(job => {
        req.flash("success_msg", "Job added");
        res.redirect("/jobs");
      })
      .catch(err => console.log(err));
  }
});

//Edit form process
router.put("/:id", ensureAuthenticated, (req, res) => {
  Job.findOne({
    _id: req.params.id
  }).then(job => {
    job.company = req.body.company;
    job.job_title = req.body.job_title;
    job.location = req.body.location;
    job.details = req.body.details;
    job.status = req.body.status;
    job.link = req.body.link;
    job.save().then(job => {
      req.flash("success_msg", "Job updated");
      res.redirect("/jobs");
    });
  });
});

//Delete Job
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Job.findOneAndDelete({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Job removed");
    res.redirect("/jobs");
  });
});

module.exports = router;
