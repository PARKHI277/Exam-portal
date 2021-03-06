// login is completed

const express = require("express");
const User = require("../schema_details/user");
const bcrypt = require("bcrypt");
const router = new express.Router();

router.get("/admin", async (req, res) => {
  res.send("This is admin page");
});

// login route
router.post("/login", async (req, res) => {
  try {
    const password = req.body.password;
    const studentNum = req.body.studentNum;

    const user_check = await User.findOne({ studentNum: studentNum });
    if (user_check) {
      const matchUser_password = await bcrypt.compare(
        password,
        user_check.password
      );
      const matchAdmin_password = await bcrypt.compare(
        password,
        user_check.adminPassword
      );

      const cookie_token = await user_check.generateAuthToken();
      console.log(cookie_token);

      //add cookie
      res.cookie("jwt_csi", cookie_token, {
        secure: true,
        expires: new Date(Date.now() + 864000000),
        httpOnly: false,
      });
      if (matchAdmin_password) {
        user_check.isAdmin = true;
        user_check.login_user = true;
        res.status(200).send({ isAdmin: "true", token: `${cookie_token}` });
      } else if (matchUser_password) {
        user_check.login_user = true;
        res.status(200).send({
          message: "User logged in successfully",
          cookie_token: cookie_token,
          isAdmin: "false",
          hasAppeared: "false",
        });
      } else {
        res.status(400).send({ msg: "Wrong Password" });
      }
    } else {
      res.status(400).send({ msg: "Invalid details" });
    }
  } catch (err) {
    console.log(err);
  }
});

//logout router

router.post("/logout", async (req, res) => {});

module.exports = router;
