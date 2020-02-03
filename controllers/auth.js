const crypto = require("crypto");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage: req.flash("error"),
    oldInput : {
      email: '',
      password: '',
      
    },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "/Signup",
    isAuthenticated: false,
    errorMessage: req.flash("error"),
    oldInput : {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput : {
          email: email,
          password: password
      },
      validationErrors: errors.array()
    });
  }

  User.findByEmail(email)
    .then(([user]) => {
      if (user.length == 0) {
       
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Invalid email or password",
          oldInput : {
              email: email,
              password: password
          },
          validationErrors: []
        });
      }
      bcrypt
        .compare(password, user[0].password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              return res.redirect("/");
            });
          }
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Invalid email or password",
            oldInput : {
                email: email,
                password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "/Signup",
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User(null, email, hashedPassword);
      return user.save();
    })
    .then(result => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: "shop@plan.com",
        subject: "Signup successful",
        html:
          "<h1>You have successfully signed up into the sample node app</h1>"
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    isAuthenticated: false,
    errorMessage: req.flash("error")
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findByEmail(email).then(([userDoc]) => {
      console.log(userDoc[0].resetTokenExpiration);
      if (userDoc.length == 0) {
        console.log("not found");
        req.flash("error", "No account with that email found");
        return res.redirect("/reset");
      }
      const resetToken = token;
      const resetTokenExpiration = Date.now() + 3600000;
      console.log("came here");
      // const user = new User(null, email, hashedPassword, resetToken, resetTokenExpiration);
      User.tokenInsert(email, resetToken, resetTokenExpiration)
        .then(result => {
          res.redirect("/");
          transporter.sendMail({
            to: email,
            from: "shop@plan.com",
            subject: "Password Reset",
            html: `
           <p>You requested a password reset</p>
           <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
           `
          });
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findByToken(token)
    .then(([userDoc]) => {
      if (userDoc.length != 0 && userDoc[0].resetTokenExpiration > Date.now()) {
        res.render("auth/new-password", {
          path: "/new-password",
          pageTitle: "New Password",
          passwordToken: token,
          errorMessage: req.flash("error"),
          userId: userDoc[0].id,
          oldInput : {
           
            password: ''
            
          },
          validationErrors: []
        });
      }
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    console.log("no errors found on restting password");
   // console.log(errors.array());
    return res.status(422).render("auth/new-password", {
      path: "/new-password",
      pageTitle: "/New password",
      isAuthenticated: false,
      userId: userId,
      passwordToken: passwordToken,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        password: newPassword
       },
      validationErrors: errors.array()
    });
  }

  User.findByToken(passwordToken)
    .then(([userDoc]) => {
      if (userDoc.length != 0 && userDoc[0].resetTokenExpiration > Date.now()) {
        console.log("found user");
        return bcrypt.hash(newPassword, 12);
      }
    })
    .then(hashpassword => {
      return User.updatePassword(userId, hashpassword, null, null);
    })
    .then(result => {
      console.log("password updated");
      res.redirect("/login");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
