const Model = require("../models/user.model.js");
const randomstring = require("randomstring");
const {
  generateJwtAccessToken,
  checkPassword,
  createHashPassword,
  PASSWORD_REGEX,
} = require("../helper/index.js");
const { Status, EmailVerified } = require("../helper/typeConfig.js");
const { HttpStatus } = require("../utils/httpStatus.js");
const { errorHandler } = require("../utils/errorHandler.js");
const { ApiMessage } = require("../utils/ApiMessage.js");

const userLogin = async (params) => {
  try {
    const { email, password } = params;
  
    let query = {
      deletedAt: null,
      $or: [{ email }, { username: email }],
    };
  
    const userDetails = await Model.findOne(query, {
      firstName: 1,
      email: 1,
      password: 1,
      role: 1,
      emailVerified: 1,
      status: 1,
      lastName: 1,
      roleData: 1,
    });
  
    if (!userDetails) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: ApiMessage.EMAIL_NOT_REGISTER,
      };
    }
  
    if (!userDetails.password) {
      return {
        status: HttpStatus.EXPECTATION_FAILED,
        message: "You have to set your password first in order to log in",
        emailVerified: userDetails.emailVerified,
      };
    }
  
    if (!checkPassword(password, userDetails.password)) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: `Hey ${userDetails.firstName}, ${ApiMessage.INVALID_PASSWORD}`,
      };
    }
  
    if (userDetails.status !== Status.ACTIVE) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: ApiMessage.ACCOUNT_DEACTIVATED,
      };
    }
  
    if (userDetails.emailVerified !== EmailVerified.VERIFIED) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: ApiMessage.ACCOUNT_NOT_VERIFIED,
        userNotVerified: true,
      };
    }
  
    const refreshToken = randomstring.generate(256);
    await Model.updateOne(
      { _id: userDetails._id },
      { $push: { refreshTokens: refreshToken }, lastLogin: new Date() }
    );
  
    const accessToken = await generateJwtAccessToken({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
    });
  
    return {
      status: HttpStatus.OK,
      message: `Hi ${userDetails.firstName}, ${ApiMessage.LOGIN_SUCCESS}.`,
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRE_TIME,
    };
  } catch (error) {
    return errorHandler(error, params);
  }
  
};

const signup = async (params) => {
  try {
    let checkEmail;
    if (params.email) {
      checkEmail = await Model.findOne({
        email: params.email,
        deletedAt: null,
      });
    }

    if (checkEmail)
      return {
        status: HttpStatus.BAD_REQUEST,
        message: ApiMessage.EMAIL_EXISTS,
      };
    if (params.password) {
      if (!PASSWORD_REGEX.test(params.password)) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: ApiMessage.PASSWORD_VALIDATION,
        };
      }
      params.password = createHashPassword(params.password);
    }

    const newUser = await new Model({
      ...params,
      emailVerified: 1,
    }).save();

    const refreshToken = randomstring.generate(256);
    await Model.updateOne(
      { _id: newUser._id },
      { $push: { refreshTokens: refreshToken }, lastLogin: new Date() }
    );

    return {
      status: HttpStatus.OK,
      message: "You successfully signed up!",
    };
  } catch (error) {
    console.log(error);
    return errorHandler(error, params);
  }
};

const refresh = async (params) => {
  try {
    const userDetails = await Model.findOne({
      refreshTokens: params.refreshToken,
      deletedAt: null,
    }).select(Model.Select.JWT_FIELDS);

    if (!userDetails) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: "Access Denied! Try again",
      };
    }

    await Model.updateOne(
      { _id: userDetails._id },
      { $pull: { refreshTokens: params.refreshToken } }
    );

    const refreshToken = randomstring.generate(256);
    await Model.updateOne(
      { _id: userDetails._id },
      {
        $push: { refreshTokens: refreshToken },
        last_login: new Date(),
      }
    );

    const accessToken = await generateJwtAccessToken({
      email: userDetails.email,
      fullname: userDetails.fullname,
      username: userDetails.username,
    });

    return {
      status: HttpStatus.OK,
      message: "New token successfully egenrated.",
      accessToken,
      refreshToken,
    };
  } catch (err) {
    return errorHandler(err, params);
  }
};

module.exports = {
  userLogin,
  signup,
  refresh,
};
