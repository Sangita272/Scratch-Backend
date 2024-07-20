const search = (keys, keyword) => {
  let searchData = [];
  keys.filter((it) => {
    if (typeof it === "string") {
      searchData.push({ [it]: { $regex: keyword, $options: "i" } });
    }
  });
  return searchData;
};

const statusSearch = (status) => {
  if (Array.isArray(status)) {
    let resultStatus = status.map((i) => Number(i));
    return { $in: resultStatus };
  } else {
    return parseInt(status);
  }
};

const arrayObjectIdSearch = (elements) => {
  if (!Array.isArray(elements)) {
    return { $elemMatch: { $eq: new ObjectId(elements) } };
  } else {
    let res = elements.map((el) => new ObjectId(el));
    return { $elemMatch: { $in: res } };
  }
};

module.exports = {
  search,
  statusSearch,
  arrayObjectIdSearch,
};
