const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();
const User = require("../models/user");

const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),

    body("password", "Password has to be valid")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email address is forbidden");
        // }
        // return true;

        return User.findByEmail(value).then(([userDoc]) => {
          if (userDoc.length != 0) {
            return Promise.reject(
              "Email already exists, please pick a different one"
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with numbers and text."
    )
      .isLength({ min: 5 })
      //   .withMessage("Please enter an email with minimum 5 letters")
      .isAlphanumeric()
      .trim(),
    //   .withMessage("Please enter an email with only numbers and text")
    body("confirmPassword").trim().custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match");
      }
      return true;
    })
  ],
  authController.postSignup
);
router.post("/logout", authController.postLogout);
router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post(
  "/new-password",
  [
    body("password", "Password has to be valid")
      .isLength({ min: 5 })
      .isAlphanumeric()
  ],
  authController.postNewPassword
);

module.exports = router;
