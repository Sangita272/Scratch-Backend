const log4js = require("log4js");
const fs = require("fs");
const path = require("path");

const date = new Date();
const fileName = path.join(
  __dirname,
  "../public/logs/error-" +
    (date.getMonth() + 1) +
    "-" +
    date.getFullYear() +
    ".log"
);

!fs.existsSync(fileName) && fs.appendFile(fileName, "", (e) => {});

log4js.configure({
  appenders: { monthly: { type: "file", filename: fileName } },
  categories: { default: { appenders: ["monthly"], level: "error" } },
});

const logger = log4js.getLogger("monthly");

const error = async (...params) => {
  logger.error(params);
};
const info = async (...params) => {
  logger.info(params);
};
const trace = async (...params) => {
  logger.trace(params);
};
const debug = async (...params) => {
  logger.debug(params);
};

const build = ({ fileName = "logs", level = "info", type = "monthly" }) => {
  let date = new Date();
  let suffix = "";
  if (type == "daily") suffix += date.getDate() + "-";
  if (type == "daily" || type == "monthly") suffix += date.getMonth() + 1 + "-";
  if (type == "daily" || type == "monthly" || type == "yearly")
    suffix += date.getFullYear();

  fileName += "-" + suffix;

  fileName = path.join(__dirname, `../public/logs/${fileName}.log`);
  log4js.configure({
    appenders: { [type]: { type: "file", filename: fileName } },
    categories: { default: { appenders: [type], level: level } },
  });

  return log4js.getLogger(type);
};

module.exports = { error, trace, info, debug, build, logger };
