const { default: mongoose } = require("mongoose");
const { MapLocationType, Status } = require("../helper/typeConfig");

const coordinatesSchema = mongoose.Schema({
  lat: { type: Number, default: null },
  lng: { type: Number, default: null },
});

const locationSchema = mongoose.Schema({
  address1: { type: String, default: null },
  address2: { type: String, default: null },
  city: { type: String, default: null },
  state: { type: String, default: null },
  country: { type: String, default: null },
  zipcode: { type: String, default: null },
  type: {
    type: String,
    enum: Object.values(MapLocationType),
    default: MapLocationType.POINT,
  },
  coordinates: { type: coordinatesSchema, default: null },
});

const socialMediaSchema = mongoose.Schema({
  name: { type: String, default: null },
  icon: { type: String, default: null },
  image: { type: String, default: null },
  url: { type: String, default: null },
  status: { type: Number, enum: Object.values(Status), default: Status.ACTIVE },
});

const fileSchema = mongoose.Schema(
  {
    url: { type: String, default: null },
    filename: { type: String, default: null },
    size: { type: String, default: null },
    extension: { type: String, default: null },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

const buyerSchema = mongoose.Schema({
  buyerCompany: { type: String, default: null },
  buyerName: { type: String, default: null },
  buyerEmail: { type: String, default: null },
  buyerPhone: { type: String, default: null },
  buyerAddress: { type: String, default: null },
  buyerWebsite: { type: String, default: null },
});

const sellerSchema = mongoose.Schema({
  sellerName: { type: String, default: null },
  sellerEmail: { type: String, default: null },
  sellerPhone: { type: String, default: null },
  sellerAddress: { type: String, default: null },
  sellerWebsite: { type: String, default: null },
});

const customFieldSchema = mongoose.Schema({
  fieldName: { type: String, default: null },
  fieldType: { type: String, default: null },
  fieldValue: { type: String, default: null },
});

module.exports = {
  locationSchema,
  socialMediaSchema,
  fileSchema,
  buyerSchema,
  sellerSchema,
  customFieldSchema,
};
