// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
// Requiring models folder to access the data
const db = require("../models");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/signup", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/game");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/game");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  app.get("/verifyemail", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/game");
    }
    res.sendFile(path.join(__dirname, "../public/verifyemail.html"));
  });

  app.get("/resetpass/:resetPasswordToken", (req, res) => {
    db.User.findOne({
      where: { resetPasswordToken: req.params.resetPasswordToken }
    }).then(dbUser => {
      if (!dbUser) {
        res.sendFile(path.join(__dirname, "../public/error.html"));
      } else {
        res.render("resetpassword", {
          User: dbUser.dataValues
        });
      }
    });
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page

  app.get("/game", isAuthenticated, (req, res) => {
    db.Score.findAll({
      limit: 10,
      order: [["score", "DESC"]],
      include: [db.User]
    }).then(dbScore => {
      res.render("game", { Score: dbScore.map(score => score.toJSON()) });
    });
  });
};
