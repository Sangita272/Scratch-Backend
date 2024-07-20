const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-aggregate-paginate-v2");
const {
  Status,
  TableNames,
  EmailVerified,
  UserRole: Role,
} = require("../helper/typeConfig.js");

const Platform = { WEB: "web", APP: "app" };

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: {
      type: String,
      match: /.+\@.+\..+/,
      trim: true,
      lowercase: true,
      default: null,
    },
    emailVerified: {
      type: Number,
      enum: Object.values(EmailVerified),
      default: EmailVerified.UNVERIFIED,
    },
    emailVerifiedAt: { type: Date, default: null },
    password: {
      type: String,
      select: false,
      trim: true,
      default: null,
    },
    status: {
      type: Number,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
    refreshTokens: { type: [String], default: [] },
    lastLogin: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TableNames.USERS,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TableNames.USERS,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TableNames.USERS,
      default: null,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model(TableNames.USERS, userSchema);
module.exports.Role = Role;
module.exports.Platform = Platform;
module.exports.Select = {
  BASIC_FIELDS: {
    firstName: 1,
    email: 1,
    lastName: 1,
  },
  HIDDEN_FIELDS: {
    password: 0,
    otp: 0,
    otpSendTime: 0,
    refreshTokens: 0,
    deletedAt: 0,
    deletedBy: 0,
    createdBy: 0,
    updatedBy: 0,
  },
  JWT_FIELDS: { firstName: 1, email: 1, lastName: 1 },
};
