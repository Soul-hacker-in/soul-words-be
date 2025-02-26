// index.js
const express = require("express");
const mysql = require("mysql");
const PORT = process.env.PORT || 5005;
const conn = require("./Mysql_config");
const myWebsite = require("./allowedSites");
const cors = require("cors");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: myWebsite.urls,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

function mysqlConnect() {
  global.connection = mysql.createConnection(conn);

  global.connection.connect(function (err) {
    if (err) {
      console.log("Error connecting to db - " + err.sqlMessage);
      setTimeout(mysqlConnect, 2000);
    } else {
      console.log("Connected to database");
    }
  });
  global.connection.on("error", function (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      mysqlConnect();
    } else {
      throw err;
    }
  });
  global.connection.on("error", function (err) {
    if (err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
      mysqlConnect();
    } else {
      throw err;
    }
  });
  global.connection.on("error", function (err) {
    if (err.code === "ERR_UNHANDLED_REJECTION") {
      mysqlConnect();
    } else {
      throw err;
    }
  });
}

mysqlConnect();

const userRoutes = require("./routes/userRoutes");
app.use("/soul_words/api", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to My API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
