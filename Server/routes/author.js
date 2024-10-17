const express = require("express");
const User = require("../model/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const fetchusers = require('../middleware/fetchUser');

// Route to create a user
router.post(
  "/",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("name")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password")
      .isLength({ min: 5 })
      .exists()
      .withMessage("Password must be at least 5 characters long"),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: `${req.body.email} already exists` });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const secretToken = "vbnmkbbbbl"; // This should be stored in env variables in production
      const authToken = jwt.sign(data, secretToken);
      success = true;

      res.json({ success, user, authToken });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!");
    }
  }
);

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 5 })
      .exists()
      .withMessage("Password must be at least 5 characters long and cannot be blank"),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send("Enter a valid email or password");
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ success, message: "Enter a valid email or password" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const secretToken = "vbnmkbbbbl"; // Store in env variable in production
      const authToken = jwt.sign(payload, secretToken);
      success = true;

      res.json({ success, authToken });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!");
    }
  }
);

// Route to get user details
router.post("/userDetail", fetchusers, async (req, res) => {
  try {
    const userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error!");
  }
});

module.exports = router;
