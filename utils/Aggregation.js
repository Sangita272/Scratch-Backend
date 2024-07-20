const { aggregateFileConcat } = require("../helper");
const { TableNames } = require("../helper/typeConfig");
const UserAggregationLookup = ({
  localField,
  foreignField,
  alias = "user",
  pipeline = [],
  ...params
}) => {
  pipeline.push({
    $set: { "image.url": aggregateFileConcat("$image.url") },
  });

  return aggregation({
    model: "user",
    tableName: TableNames.USERS,
    alias,
    pipeline,
    localField,
    foreignField,
    ...params,
  });
};

const QuestionAggregationLookup = ({
  localField,
  foreignField,
  alias = "question",
  ...params
}) => {
  return aggregation({
    model: "question",
    tableName: TableNames.QUESTIONS,
    alias,
    localField,
    foreignField,
    ...params,
  });
};

const BookAggregationLookup = ({
  localField,
  foreignField,
  alias = "book",
  ...params
}) => {
  return aggregation({
    model: "book",
    tableName: TableNames.BOOKS,
    alias,
    localField,
    foreignField,
    ...params,
  });
};

const TestimentAggregationLookup = ({
  localField,
  foreignField,
  pipeline = [],
  alias = "testiment",
  ...params
}) => {
  pipeline.push({
    $set: { "image.url": aggregateFileConcat("$image.url") },
  });

  return aggregation({
    model: "testiment",
    tableName: TableNames.TESTIMENTS,
    alias,
    pipeline,
    localField,
    foreignField,
    ...params,
  });
};

const RoleAggregationLookup = ({
  localField,
  foreignField,
  alias = "role",
  ...params
}) => {
  return aggregation({
    model: "role",
    tableName: TableNames.ROLES,
    alias,
    localField,
    foreignField,
    ...params,
  });
};

const GroupAggregationLookup = ({
  localField,
  foreignField,
  alias = "groups",
  ...params
}) => {
  return aggregation({
    model: "group",
    tableName: TableNames.GROUPS,
    alias,
    localField,
    foreignField,
    ...params,
  });
};

const aggregation = ({
  model,
  tableName,
  localField,
  foreignField,
  alias,
  project = {},
  match = [],
  pipeline = [],
}) => {
  const Model = require(`../models/${model}.model`);
  const aggPipeline = [];
  aggPipeline.push({
    $match: {
      $expr: { $and: [...match, { $eq: ["$deletedAt", null] }] },
    },
  });

  if (pipeline.length > 0) for (let item of pipeline) aggPipeline.push(item);

  if (Object.entries(project).length > 0)
    aggPipeline.push({ $project: project });
  else aggPipeline.push({ $project: Model.Select.BASIC_FIELDS });

  return {
    $lookup: {
      from: tableName,
      localField,
      foreignField,
      as: alias,
      pipeline: aggPipeline,
    },
  };
};

module.exports = {
  UserAggregationLookup,
  QuestionAggregationLookup,
  BookAggregationLookup,
  TestimentAggregationLookup,
  RoleAggregationLookup,
  GroupAggregationLookup,
};
