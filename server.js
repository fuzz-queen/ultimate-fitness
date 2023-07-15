require("dotenv").config();
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const PORT = 5000;
const client = require("./db/client");
const app = express();

client.connect();
// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Routes
const apiRouter = require('./routes')
const routinesRouter = require('./routes/routines');
app.use("/api", apiRouter);

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.get("/test", (req, res, next) => {
  res.send("Authorization granted");
})

app.use((err, req, res, next) => {
  res.send({
    message: err.message,
    name: err.name,
    stack: err.stack,
  })
})

// Error Handler
app.use((err, req, res, next) => {
  res.send({
    message: err.message,
    name: err.name,
    stack: err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
