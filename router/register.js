const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      studentNum,
      rollNum,
      mobileNum,
      year,
      branch,
      gender,
      domain,
      isHosteler,
    } = await req.body;
    const userExist = await User.findOne({
      rollNum,
      mobileNum,
      email,
      studentNum,
    });

    if (userExist) {
      return res.status(400).send({ msg: "These user details already exists" });
    }

    const user_create = new User({
      name,
      email,
      studentNum,
      rollNum,
      mobileNum,
      password: `${process.env.USERPASSWORD}@${studentNum}`,
      year,
      branch,
      gender,
      domain,
      isHosteler,
    });

    // bcrypt password
    const salt = await bcrypt.genSalt(10);
    user_create.password = await bcrypt.hash(user_create.password, salt);

    const saveUser = await user_create.save();

    // sending mail
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.id,
    //     pass: process.env.pass,
    //   },
    // });

    // const mailOptions = {
    //   from: process.env.id,
    //   to: user_create.email,
    //   subject: "Registered for CINE'22",

    //   html:
    //     "<p>Team CSI congratulates you for being successfully registered for CINE'22. Brace yourself, fasten your seatbelts, polish your skills, and be ready for the most exciting recruitment drive.</p>" +
    //     "<h4>Mode: Offline</h4>" +
    //     "<h4>Date: 19 Sept 2022</h4>" +
    //     "<h4>Time: 4pm-6pm</h4>" +
    //     "<h4>Venue: Basic IT Lab( CSIT Block)</h4>" +
    //     "<h4>Stay Tuned to our Instagram page for further information.</h4>" +
    //     "<h4>https://www.instagram.com/csi_akgec/</h4>" +
    //     "<h4>Regards,</h4>" +
    //     "<h4>Team CSI</h4>",
    // };

    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("OTP sent: " + info.response);
    //   }
    // });
    res.status(200).send({
      message: "User Successfully Registered",
      id: saveUser._id,
    });
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});

//getting user
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// delete a user
router.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This user id doesn't exixt",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Account deleted",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

// Update a user
router.patch("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json("Account got updated");
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

module.exports = router;