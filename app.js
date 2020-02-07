const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/Jobber', {useUnifiedTopology: true, useNewUrlParser: true})
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

//Load Idea Model
require("./models/Job");
const Job = mongoose.model("jobs");

//Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method override middleware
app.use(methodOverride('_method'));

//Index route
app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("index", {
    title: title
  });
});

//About route
app.get("/about", (req, res) => {
  res.render("about");
});

//Job index page
app.get('/jobs',(req, res)=> {
  Job.find({})
  .sort({date: 'desc'})
  .then(jobs => {
    res.render('jobs/index', {
      jobs: jobs
    });
  });
});

//Add Idea Form
app.get("/jobs/add", (req, res) => {
  res.render("jobs/add");
});

//Edit Idea Form
app.get("/jobs/edit/:id", (req, res) => {
  Job.findOne({
    _id:req.params.id
  })
  .then(job => {
    console.log(job._id)
    res.render('jobs/edit', {
      id:job._id,
      company: job.company,
      location: job.location,
      job_title: job.job_title,
      status: job.status,
      details: job.details,
      link: job.link
    });
  });
});

//Process form
app.post("/jobs/add", (req, res) => {
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
      status: 'In Progress' ,
      details: req.body.details,
      link: req.body.link,
    };
    new Job(newUser)
    .save()
    .then(idea => {
      res.redirect('/jobs')
    })
    .catch(err => console.log(err));
  }
});

//Edit form process
app.put('/jobs/:id', (req, res) => {
  res.send('PUT');
})

const port = 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
