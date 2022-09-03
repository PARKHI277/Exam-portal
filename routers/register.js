const express = require("express");
const router = new express.Router();
const User = require("../schema_details/user");
const nodemailer = require("nodemailer");

router.get("/register", async (req, res) => {
  try {
    const Usersdata = await User.find();
    res.status(201).send(Usersdata);
  } catch (err) {
    res.status(400).send(err);
  }
});
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
    const userExist = await User.findOne({ rollNum });

    if (userExist) {
      return res.status(200).send({ msg: "User already exists." });
    }

    const user_create = new User({
      name,
      email,
      studentNum,
      rollNum,
      mobileNum,
      password: `${process.env.USERPASSWORD}@${studentNum}`,
      adminPassword: `${process.env.ADMINPASSWORD}@${studentNum}`,
      year,
      branch,
      gender,
      domain,
      isHosteler,
    });

    const saveUser = await user_create.save();

    // sending mail

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "testapi277@gmail.com",
        pass: process.env.pass,
      },
    });

    const mailOptions = {
      from: process.env.email,
      to: req.body.email,
      subject: "CINE'21",
      html:
        "<h3>CONGRATULATION,</h3><br>" +
        "<h1 style='font-weight:bold;'>You are successfully registered</h1>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("OTP sent: " + info.response);
      }
    });
    res.status(200).send({
      message: "User Successfully Registered",
      id: saveUser._id,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// getting the user

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

// sample data
// {
//         "name": "Parkhi Garg",
//         "email": "parkhigarg27@gmail.com",
//         "studentNum":2011103,
//         "rollNum": 2000270110123,
//         "mobileNum": 7668043605,
//         "year": 2,
//         "branch": "CSIT",
//         "gender": "female",
//         "isHosteler":true,
//         "startTime":10,
//         "currentTime":15,
//         "endTime":20,
//         "lang":"C++"
// }
