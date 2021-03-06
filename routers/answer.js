const express = require("express");
const router = new express.Router();
const Answer = require("../schema_details/answer");
const Question = require("../schema_details/question");
const User = require("../schema_details/user");
const atob = require("atob");
const verify = require("../middleware/auth");

router.put("/answer", verify, async (req, res) => {
  try {
    const token = req.body.cookie_token;

    const dec = token.split(".")[1];
    const decode = JSON.parse(atob(dec)); //contains Userid
    console.log(dec);

    const { question, category, userAnswer, markRev, saveNext, ansid, Qid } =
      await req.body;
    let answer_create = new Answer({
      userId: decode,
      question,
      category,
      userAnswer,
      markRev,
      saveNext,
      mark,
      ansid,
      Qid,
    });
    await answer_create.save();

    const quesFound = await Question.findById(Qid);
    if (quesFound) {
      for (let i = 0; i < 4; i++) {
        if (userAnswer == quesFound.options[i].Oid) {
          if (quesFound.options[i].isCorrect === true) {
            await Answer.findOneAndUpdate(
              { _id: answer_create._id },
              { $set: { isCorrect: true } }
            );
            console.log("Correct answer");
          }
        }
      }
    }

    await res.status(201).send({ msg: "Answer added successfully", ansid });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/seeanswer/", async (req, res) => {
  try {
    const userId = req.body.userId;

    const AnswerData = await Answer.find({ userId: userId }).populate(
      "userId",
      "name studentNum branch score loginAt"
    );
    res.status(201).send(AnswerData);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.patch("/updateflags/:id", async (req, res) => {
  try {
    const findAns = await Answer.findById(req.params.id);;
    let f = false;
   if(findAns.ansid===1) {f=true};
   if (findAns.ansid===2) {f=true};
   if (findAns.ansid===3) {f=true};

    const findAnsUpdate = await Answer.findByIdAndUpdate(req.params.id,{
      $set: {
        markRev: f,
        saveNext: f,
        mark: f,
      }
    });

    res.status(201).send(findAnsUpdate);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.get("/flagresponse/:id", async (req, res) => {
  try {
    const findAns = await Answer.findById(req.params.id);
    const ansmark= findAns.markRev;
    const ansd= findAns.saveNext;
    const mark= findAns.mark;
    const flagStatus = {ansmark,ansd,mark}
    res.status(200).send(flagStatus);
  } catch (err) {
    res.status(400).send(err);
  }
});
module.exports = router;
