const express = require("express");
const connectDb = require("./config/connectDB");
const apiV1Route = require("./routes/api.v1.route");
const http = require("http");
const PORT = process.env.PORT || 1998;
const app = express();
const cors = require("cors");
require("./config/JWTStrategy");

app.timeout = 60000;
app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/webhook-return') {
    next();
  } else {
    express.json({ limit: '100mb' })(req, res, next);
  }
});
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api/v1", apiV1Route);

const server = http.createServer(app);

const start = async () => {
  server.listen(PORT, () => {
    console.log(`Server Started at : http://localhost:${PORT}`);
  });
  await connectDb();
};

start();
