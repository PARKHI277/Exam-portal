require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const login_router = require("./routers/login");
const register_router = require("./routers/register");
const feedbackIns = require("./routers/feed_ins");
const addquestion_router = require("./routers/addquestion");
const answer = require("./routers/answer");
const totalcandidates = require("./routers/totalcandidates");
const response_ans = require("./routers/feedresponse");
const ansMarking = require("./services/ansmarking");
require("./data_connection/data");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTION,GET,POST,PUT,PATCH,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/", (req, res) => {
  res.send("Hi,the API is working.");
});

//Middlewares
app.use(express.json());
app.use(cookieParser());

// routers -------------------

app.use("/", register_router);
app.use("/", login_router);
app.use("/", feedbackIns);
app.use("/ans/", answer);
app.use("/question", addquestion_router);

app.use("/admin", totalcandidates);
app.use("/", ansMarking);

// app.use("/total/", totalcandidates);

app.use("/response/", response_ans);
//app.use(cors(corsOptions));
const port = process.env.PORT || 4200;
app.listen(port, () => {
  console.log(`Server is running successfully on port : ${port}`);
});
