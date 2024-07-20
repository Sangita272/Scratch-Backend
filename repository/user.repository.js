const { search, statusSearch } = require("../helper/search.js");
const Model = require("../models/user.model.js");
const { ObjectId } = require("mongoose").Types;

const { createHashPassword } = require("../helper/index.js");
const { errorHandler } = require("../utils/errorHandler.js");
const { HttpStatus } = require("../utils/httpStatus.js");
const {
  PasswordValidMessage,
  PASSWORD_REGEX,
} = require("../helper/typeConfig.js");
const { ApiMessage } = require("../utils/ApiMessage.js");

function isValidEmail(email) {
  var emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailPattern.test(email);
}
const findAllData = async (params) => {
  try {
    const {
      keyword,
      limit = 10,
      offset = 0,
      status = null,
      searchValue = false,
      selectValue = "firstName lastName email",
      sortQuery = "ordering",
    } = params;
    const select = selectValue && selectValue.replaceAll(",", " ");

    let query = { deletedAt: null };

    if (Array.isArray(status)) query.status = statusSearch(status);

    if (keyword) {
      const searchQuery = searchValue
        ? searchValue.split(",")
        : select.split(" ");
      query.$or = search(searchQuery, keyword);
    }
    const myAggregate = Model.aggregate([
      { $match: query },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
        },
      },
    ]);

    const result = await Model.aggregatePaginate(myAggregate, {
      offset: offset,
      limit: limit,
      sort: sortQuery,
    });

    return { status: HttpStatus.OK, message: ApiMessage.SUCCESS, ...result };
  } catch (error) {
    return errorHandler(error, params);
  }
};

const findOneData = async (params) => {
  try {
    const query = {
      _id: new ObjectId(params.id),
      deletedAt: null,
    };

    const userData = await Model.aggregate([
      { $match: query },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
        },
      },
    ]);

    if (userData.length === 0) {
      return {
        status: HttpStatus.EXPECTATION_FAILED,
        message: "No such user found!",
      };
    }

    return {
      status: HttpStatus.OK,
      message: ApiMessage.SUCCESS,
      data: userData[0],
    };
  } catch (error) {
    console.log(error);
    return errorHandler(error, params);
  }
};

const manage = async (params) => {
  try {
    if (!isValidEmail(params.email)) {
      return {
        status: HttpStatus.FORBIDDEN,
        message: "Please provide a valid email",
      };
    }

    if (params.id) {
      const existingUser = await Model.findOne({
        _id: params.id,
        deletedAt: null,
      });
      if (!existingUser) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: "User not found",
        };
      }

      const duplicateEmail = await Model.findOne({
        email: params.email,
        _id: { $ne: existingUser._id },
        deletedAt: null,
      });
      if (duplicateEmail) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: "Email Already Exists",
        };
      }
    }

    if (params.password) {
      const passwordRegex = PASSWORD_REGEX;
      if (!passwordRegex.test(params.password.trim().replace(" ", ""))) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: PasswordValidMessage.MESSAGE,
        };
      }
      params.password = createHashPassword(params.password);
    } else {
      delete params.password;
    }

    const newData = params.id
      ? await Model.findByIdAndUpdate(
          params.id,
          {
            ...params,
          },
          { new: true }
        )
      : await new Model({
          ...params,
          emailVerified: 1,
        }).save();

    return {
      status: params.id ? HttpStatus.OK : HttpStatus.CREATED,
      message: "User Info Saved",
      data: newData,
    };
  } catch (error) {
    console.log(error);
    return errorHandler(error, params);
  }
};

const adddData = async (params) => {
  delete params.id;
  return manage(params);
};
const editData = async (params) => {
  return manage(params);
};

module.exports = {
  findAllData,
  findOneData,
  addData: adddData,
  editData: editData,
};
