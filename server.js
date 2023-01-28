const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");

const mongoURL =
  "mongodb+srv://user:user@cluster0.dbnltdi.mongodb.net/?retryWrites=true&w=majority";

const Message = mongoose.model("Message", {
  name: String,
  message: String,
});

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});
app.post("/messages", (req, res) => {
  const message = new Message(req.body);
  message.save((err) => {
    if (err) {
      sendStatus(500);
    }
    io.emit("message", req.body);
    res.sendStatus(200);
  });
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

mongoose.set("strictQuery", false);
mongoose.connect(mongoURL, (err) => {
  console.log("mongoDB connected", err);
});

const server = http.listen(3000, () => {
  console.log("server running on port", server.address().port);
});
// app.listen(3000, () => {
//   console.log("server run om port 3000");
// });
