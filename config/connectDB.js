const env = require("dotenv");
const mongoose = require("mongoose");

const dotenv = env.config();
const DATABASE_URL = process.env.DATABASE_URL;
const connectDb = () => {
  try {
    mongoose.set("runValidators", true);
    mongoose.connection.once("connected", () => {
      console.log(`Mongo Database Connected to : ${DATABASE_URL}`);
    });
    return mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    mongoose.connection.on("error", (error) => {
      console.log(error);
    });
  }
};
module.exports = connectDb;
