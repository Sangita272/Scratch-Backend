const repository = require("../repository/auth.repository");
let Validator = require("validatorjs");
const validate = require("../utils/validator");

const userLogin = async (req, res) => {
  const data = await repository.userLogin(req.body);
  return res.status(data.status).send(data);
};

const signup = async (req, res) => {
  if (!req.body?.firstName) {
    return res.send({ status: 400, message: "First Name is required" });
  }
  if (!req.body?.lastName) {
    return res.send({ status: 400, message: "Last Name is required" });
  }
  let rules = {
    email: "required",
    password: "required|min:8",
  };
  let message = {
    "required.email": "Email is required.",
    "email.email": "Please enter a valid email",
    "required.password": "Password is required",
  };
  const validation = await validate.Validator(req.body, rules, message);
  if (validation.status == 400) {
    res.send(validation);
  } else {
    const data = await repository.signup(req.body);
    return res.status(data.status).send(data);
  }
};

const verifyToken = async (req, res) => {
  try {
    const user = res.locals.authenticatedUser;
    return res.status(200).send({ message: "Token Verified", data: user });
  } catch (err) {
    return res.status(400).send({ message: "Access Denied! Try again" });
  }
};

const refreshToken = async (req, res) => {
  const data = await repository.refresh(req.body);
  return res.status(data.status).send(data);
};

module.exports = {
  verifyToken,
  refreshToken,
  signup,
  userLogin,
};
