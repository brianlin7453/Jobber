const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose
  .connect("mongodb://localhost/jobber-dev", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
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

//Add Idea Form
app.get("/jobs/add", (req, res) => {
  res.render("jobs/add");
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
      job_title: req.body.job_title,
      location: req.body.location,
      details: req.body.details,
      link: req.body.link,
      status: 'In Progress' 
    };
    new Job(newUser)
    .save()
    .then(idea => {
      res.redirect('/jobs')
    });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
