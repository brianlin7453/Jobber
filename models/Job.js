const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const date = new Date();
let dateString = date.getMonth()+1 + '/' + date.getDay() + '/' + date.getFullYear() 
//Create Schema
const JobSchema = new Schema({
  date: {
    type: String,
    default: dateString
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
