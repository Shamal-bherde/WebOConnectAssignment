const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes/authRoutes");
const session = require('express-session');
const bodyParser = require('body-parser');

app.use(express.json());
// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.listen(8081, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Started Successfully.");
  }
});

// Configure session middleware
app.use(session({
  secret: 'shreerama',
  resave: false,
  saveUninitialized: false
}));

app.use("/", routes);



