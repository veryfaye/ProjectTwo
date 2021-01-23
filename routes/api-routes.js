// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
//nodemailer items
require("dotenv").config();
const nodemailer = require("nodemailer");
//nodemailer step1
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    })
      .then(() => {
        res.redirect(307, "/api/login");
        //step2
        const mailOptions = {
          from: "space.invaders404@gmail.com",
          to: req.body.email,
          subject: "Welcome to Space Invaders",
          text: "You are now signed up with Space Invaders! Have fun!"
        };

        //step 3
        transporter.sendMail(mailOptions, err => {
          if (err) {
            console.log("Error has occured");
          } else {
            console.log("Email Sent");
          }
        });
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for sending the reset password email user out
  app.post("/api/sendResetEmail", (req, res) => {
    console.log(req.body);
    db.User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user === null) {
        console.error("email not in database");
        res.status(403).send("Email not in db");
      } else {
        const token = require("crypto")
          .randomBytes(20)
          .toString("hex");
        user.update({
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 360000
        });
        //step2
        const mailOptions = {
          from: "space.invaders404@gmail.com",
          to: `${user.email}`,
          subject: "Reset Your Space Invaders Password",
          text:
            "Click here to reset your space invaders password\n\n" +
            `http://localhost:8080/resetpass/${token}`
        };

        //step 3
        transporter.sendMail(mailOptions, err => {
          if (err) {
            console.log("Error has occured");
          } else {
            console.log("Email Sent");
          }
        });
      }
    });
  });

  // Route for resetting the users password
  app.post("/api/passreset", (req, res) => {
    console.log(req.body);
  });

  // Route for logging out the user
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        highScore: req.user.highScore
      });
    }
  });

  app.post("/api/newscore", (req, res) => {
    console.log(req.body);
    db.Score.create({
      score: req.body.score,
      UserId: req.body.UserId
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  //Route for updating the highScore using the users login
  app.put("/api/highscore", (req, res) => {
    console.log(req.body);
    console.log(req.body);
    db.User.update(
      { highScore: req.body.highScore },
      { where: { id: req.body.id } }
    ).then(dbUser => {
      res.json(dbUser);
    });
  });
};
