const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const app = express();

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose
  .connect("mongodb://localhost/quickjot-dev", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

//Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

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

const port = 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
