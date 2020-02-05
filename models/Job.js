const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const JobSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  job_title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  details: {
    type: String
  },
  link: {
    type: String
  }
});

mongoose.model("jobs", JobSchema);
