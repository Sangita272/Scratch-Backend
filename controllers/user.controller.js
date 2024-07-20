const repository = require("../repository/user.repository");
const commonRepository = require("../repository/common.repository");
const validate = require("../utils/validator");
const findAllData = async (req, res) => {
  let data = await repository.findAllData({ ...req.query, ...req.body });
  return res.status(data.status).send(data);
};

const findOneData = async (req, res) => {
  let data = await repository.findOneData({ ...req.body, ...req.params });
  return res.status(data.status).send(data);
};

const addData = async (req, res) => {
  let rules = {
    firstName: "required",
    lastName: "required",
    email: "required",
    password: "required|min:8",
  };
  let message = {
    "required.firstName": "First Name is required.",
    "required.lastName": "Last Name is required.",
    "required.email": "Email is required.",
    "email.email": "Please enter a valid email",
    "required.password": "Password is required",
  };
  const validation = await validate.Validator(req.body, rules, message);
  if (validation.status == 400) {
    res.status(400).send(validation);
  } else {
    const data = await repository.addData({ ...req.body, image: req.file });
    return res.status(data.status).send(data);
  }
};

const editData = async (req, res) => {
  let rules = {
    firstName: "required",
    lastName: "required",
    email: "required",
  };
  let message = {
    "required.firstName": "First Name is required.",
    "required.lastName": "Last Name is required.",
    "required.email": "Email is required.",
    "email.email": "Please enter a valid email",
  };
  const validation = await validate.Validator(req.body, rules, message);
  if (validation.status == 400) {
    res.status(400).send(validation);
  } else {
    const data = await repository.editData({
      ...req.body,
      image: req.file,
      ...req.params,
    });
    return res.status(data.status).send(data);
  }
};

const remove = async (req, res) => {
  let data = await commonRepository.remove({
    ...req.body,
    model: "user",
  });
  return res.status(data.status).send(data);
};


const changeStatus = async (req, res) => {
  let data = await commonRepository.changeStatus({
    ...req.body,
    model: "user",
  });
  return res.status(data.status).send(data);
};

module.exports = {
  findAllData,
  findOneData,
  addData,
  editData,
  remove,
  changeStatus,
};
