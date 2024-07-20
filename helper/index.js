const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { default: slugify } = require("slugify");
const randomstring = require("randomstring");
const PASSWORD_REGEX = /^.{8,}$/;
const BIRTHYEAR_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const userModel = require("../models/user.model");
const { v4: uuidv4 } = require("uuid");

const generateJwtAccessToken = async (params) => {
  return jwt.sign({ ...params }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

const verifyJwtToken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

const checkPassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

const createHashPassword = (password) => {
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(password, salt);
};

const convertFieldsToAggregateObject = (fields, demilater = ",") => {
  if (!fields) return { deletedAt: 0, deletedBy: 0 };
  if (typeof fields == "string") {
    fields = fields.trim();
    fields = fields.split(demilater);
  }
  let obj = {};
  for (let el of fields) if (el) obj[el] = 1;

  return obj;
};

const aggregateFileConcat = (column) => {
  return {
    $cond: {
      if: { $eq: [column, null] },
      then: null,
      else: { $concat: [process.env.BASE_URL, column] },
    },
  };
};

const generateOTP = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(min + Math.random() * (max - min + 1));
};

const dateDiffInMinutes = (date1, date2) => {
  const total = date1.getTime() - date2.getTime();
  return Math.floor(total / 1000 / 60);
};

const createSlug = (slug) => {
  return slugify(slug, {
    lower: true,
    remove: undefined,
    trim: true,
  });
};

const checkEmptySpaceTabs = (data) => {
  const regex = /^\s*$/;
  return data === undefined || regex.test(data);
};

const aggregateArrayFileConcat = (fields) => {
  return {
    $map: {
      input: fields,
      as: "image",
      in: {
        $mergeObjects: [
          "$$image",
          { url: { $concat: [process.env.BASE_URL, "$$image.url"] } },
        ],
      },
    },
  };
};

const convertRangeStringToArray = (rangeString) => {
  // Split the rangeString by the hyphen ("-")
  const [start, end] = rangeString.split("-").map(Number);

  // Check if start and end are valid numbers
  if (isNaN(start) || isNaN(end)) {
    return [];
  }

  // Generate an array of numbers from start to end
  const result = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return result;
};

const makeid = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const userMail = async (data) => {
  let token = randomstring.generate(100) + Date.now();
  await userModel.updateMany(
    {
      uuid: data.uuid,
    },
    {
      $set: {
        token: token,
      },
    }
  );
  let accept = `https://9boxnow.iosx.in/accept-employee?token=${token}&status=1`;

  let reject = `https://9boxnow.iosx.in/reject-user?token=${token}&status=2`;

  await SendAddUserMail(
    data.firstName,
    data.lastName,
    data.email,
    accept,
    reject
  );
};

const companyAdministratorMail = async (data) => {
  let token = randomstring.generate(100) + Date.now();
  await userModel.updateMany(
    {
      uuid: data.uuid,
    },
    {
      $set: {
        token: token,
      },
    }
  );
  setTimeout(async () => {
    await userModel.updateOne({ uuid: data.uuid }, { $set: { token: null } });
  }, 10 * 60 * 1000);
  let accept = `https://9boxnow.iosx.in/accept-administrator?token=${token}&status=1`;

  let reject = `https://9boxnow.iosx.in/reject-administrator?token=${token}&status=2`;

  await SendAddCompanyAdministratorMail(
    data.firstName,
    data.email,
    accept,
    reject
  );
};

const generateRandomString = async () => {
  return uuidv4();
};

module.exports = {
  generateJwtAccessToken,
  PASSWORD_REGEX,
  checkPassword,
  createHashPassword,
  convertFieldsToAggregateObject,
  verifyJwtToken,
  generateOTP,
  dateDiffInMinutes,
  aggregateFileConcat,
  createSlug,
  aggregateArrayFileConcat,
  convertRangeStringToArray,
  BIRTHYEAR_REGEX,
  makeid,
  userMail,
  checkEmptySpaceTabs,
  generateRandomString,
  companyAdministratorMail,
};
