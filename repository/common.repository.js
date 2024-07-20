
const { HttpStatus } = require("../utils/httpStatus");

exports.remove = async (params) => {
  try {
    let Model;

    Model = require(`../models/${params.model}.model`);
    if (Array.isArray(params.id)) {
      await Model.updateMany(
        { _id: { $in: params.id }, deletedAt: null },
        {
          deletedAt: new Date(),
          deletedBy: params.authUser ? params.authUser._id : null,
        }
      );
    } else {
      const del = await Model.updateMany(
        { _id: params.id, deletedAt: null },
        {
          deletedAt: new Date(),
          deletedBy: params.authUser ? params.authUser._id : null,
        }
      );
      if (del.modifiedCount === 0)
        return { status: HttpStatus.NOT_FOUND, message: "Data not found" };

      
    }

    return { status: HttpStatus.OK, message: "Record delete successfull" };
  } catch (err) {
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: err.message };
  }
};

exports.changeStatus = async (params) => {
  try {
    statusChange = await require(`../models/${params.model}.model`).updateMany(
      { _id: { $in: params.id }, deletedAt: null },
      { ...params, updatedBy: params.authUser ? params.authUser._id : null }
    );
    if (statusChange.modifiedCount === 0) {
      return { status: HttpStatus.NOT_FOUND, message: "Data not found" };
    }
    return {
      status: HttpStatus.OK,
      message: "Record Status Change successfull",
      data: statusChange,
    };
  } catch (err) {
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: err.message };
  }
};

exports.saveOrdering = async (params) => {
  try {
    params.data.forEach(async (element) => {
      await require(`../models/${params.model}.model`).findOneAndUpdate(
        { _id: element.id },
        { ordering: element.ordering }
      );
    });

    return { status: HttpStatus.OK, message: "Ordering saved" };
  } catch (err) {
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: err.message };
  }
};
