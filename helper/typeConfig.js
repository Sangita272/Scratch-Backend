const { v4: uuidv4 } = require("uuid");
const Status = { ACTIVE: 1, INACTIVE: 2, DRAFT: 3 };
const Featured = { FEATURED: 1, UNFEATURED: 2 };
const EmailVerified = { VERIFIED: 1, UNVERIFIED: 2 };

const ratingCode = {
  yearsOfManagerExperience: "yearsOfManagerExperience",
  yearsOfSeniorManagerExperience: "yearsOfSeniorManagerExperience",
  seniorManagementExperience: "seniorManagementExperience",
  managementExperience: "managementExperience",
  yearsWithCompany: "yearsWithCompany",
  levelOfEducation: "levelOfEducation",
  performanceRating: "performanceRating",
  loyalty: "loyalty",
  desireToAdvance: "desireToAdvance",
  retirementWindow: "retirementWindow"
}

const MapLocationType = {
  POINT: "Point",
  LINE_STRING: "LineString",
  PLOYGON: "Polygon",
  MULTI_POINT: "MultiPoint",
};

const itemType= {
CURRENT: "current",
ARCHIVE: "archive",
WISHLIST: "wishlist"
}

const PaymentStatus = { PENDING: 1, SUCCESS: 2, REJECT: 3, REFUND: 4 };
const SubscriptionStatus = { ACTIVE: 1, CANCEL: 2, EXPIRE: 3 };

const enquiryType = { TICKET: "ticket", ENQUIRY: "enquiry" };

const SubscriptionType = {
  DONATION: "donation",
  SUBSCRIPTION_REQUEST: "subscription",
  HINT: "hint",
  QUIZ: "quiz",
  ONE_TIME_PAYMENT: "One_Time_Payment"
};
const paymentMethod= {
  STRIPE: "stripe",
  APPLE: "apple",
  MANUAL: "manual"
}

const dicountType = { FIXED: "fixed", PERCENTAGE: "percentage" };

const discountFor = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
  ADDONUSER: "addonUser",
};

const planCode = { MONTHLY: "monthly", YEARLY: "yearly" };

const PasswordValidMessage = {
  MESSAGE:
    "Minimum eight characters, please",
};

const SemdOtpEmailMessage = {
  MESSAGE:
    "Hi,Congratulations on signing up at Invenstory. Please use the following six digits numerical One Time Password to validate your email address.",
};

const PASSWORD_REGEX =/^.{8,}$/;

const generateRandomString = async () => {
  return uuidv4();
};

const PlanDurationType = {
  DAILY: "day",
  MONTHLY: "month",
  YEARLY: "year",
};

const TableNames = {
  ROLES: "roles",
  USERS: "users",
  EMPLOYEE_RATING_OPTIONS: "company_rating_options",
  EMPLOYEE_RATING: "employee_ratings",
  FAQS: "faqs",
  COUNTRIES: "countries",
  PAGES: "pages",
  SITE_SETTINGS: "site_settings",
  EMAIL_TEMPLATES: "email_templates",
  NOTIFICATIONS: "notifications",
  LANGUAGES: "languages",
  PARTNERS: "partners",
  TESTIMONIALS: "testimonials",
  SERVICES: 'services',
  FOLDERS: "folders",
  FEATURES: "features",
  ITEMS: "items",
  TAGS: "tags",
  FIELDS: "fields",
  POSITIONS: "positions",
  EMPLOYEES: "employees",
  RESOURCES: "resources",
  COMPETENCY: "competency",
  PLANS: "plans",
  EMPLOYEE_SCORES: "employee_scores"
};

const LetterCase = {
  UPPER_CASE: "UPPER_CASE",
  LOWER_CASE: "LOWER_CASE",
  CAMEL_CASE: "CAMEL_CASE",
};


const UserRole = {
  USER: "COMPANY-EMPLOYEE",
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  ORGANIZATION: "ORGANIZATION",
  COMPANY: "COMPANY",
  COMPANY_ADMINISTRATOR: "COMPANY_ADMINISTRATOR",
  COMPANY_MANAGER: "COMPANY_MANAGER"
};

const NotificationTypeEnum = {
  SMS: "SMS",
  EMAIL: "EMAIL",
};

const EmailTemplateCodeEnum = {
  NOTIFICATION: "notification",
  OTP_VERIFICATION: "otp-verification",
  RESET_PASSWORD: "reset-password",
  HELP: "help",
  ADD_EMPLOYEE:"add-employee",
  ADD_COMPANY_ADMINISTRATOR: "add-company-administrator"
};
module.exports = {
  Status,
  Featured,
  MapLocationType,
  TableNames,
  EmailVerified,
  LetterCase,
  UserRole,
  PaymentStatus,
  SubscriptionStatus,
  enquiryType,
  PlanDurationType,
  NotificationTypeEnum,
  EmailTemplateCodeEnum,
  SubscriptionType,
  dicountType,
  generateRandomString,
  SemdOtpEmailMessage,
  PasswordValidMessage,
  PASSWORD_REGEX,
  discountFor,
  planCode,
  paymentMethod,
  itemType,
  ratingCode
};
