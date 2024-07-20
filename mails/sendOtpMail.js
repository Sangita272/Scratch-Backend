const Model = require("../models/emailTemplate.model");
const SiteSettingModel = require("../models/siteSetting.model");
const { MailSender } = require("../config/mailer");
const { EmailTemplateCodeEnum } = require("../helper/typeConfig");

const SendOtpMail = async ({ email, otp, username }) => {
  const emailTemplate = await Model.findOne({
    code: EmailTemplateCodeEnum.OTP_VERIFICATION,
    deletedAt: null,
    mailFor: "user"
  });
  if (!emailTemplate)
    throw new Error(
      "Email template not Found on this Code " +
        EmailTemplateCodeEnum.OTP_VERIFICATION
    );

  const SiteSetting = await SiteSettingModel.findOne().lean();
  let html = emailTemplate.content
    .replaceAll("{%APP_NAME%}", SiteSetting.title)
    .replaceAll("{%SITE_NAME%}", SiteSetting.title)
    .replaceAll("{%USER_NAME%}", username)
    .replaceAll("{%USER_OTP%}", otp)
    .replaceAll("{%LOGO%}", process.env.BASE_URL+SiteSetting.logo.url);

  const mailData = {
    from: { name: emailTemplate.fromName, address: emailTemplate.fromMail },
    html,
    to: email,
    subject: emailTemplate.subject,
  };

  await MailSender.send(mailData);
};

const ResetPasswordSendOtpMail = async ({ email, otp, username }) => {
  const emailTemplate = await Model.findOne({
    code: EmailTemplateCodeEnum.RESET_PASSWORD,
    deletedAt: null,
  });
  if (!emailTemplate)
    throw new Error(
      "Email template not Found on this Code " +
        EmailTemplateCodeEnum.RESET_PASSWORD
    );

  const SiteSetting = await SiteSettingModel.findOne().lean();
  let html = emailTemplate.content
    .replaceAll("{%APP_NAME%}", SiteSetting.title)
    .replaceAll("{%SITE_NAME%}", SiteSetting.title)
    .replaceAll("{%USER_NAME%}", username)
    .replaceAll("{%USER_OTP%}", otp)
    .replaceAll("{%LOGO%}", process.env.BASE_URL+SiteSetting.logo.url)
    .replaceAll("{%EMAIL%}", SiteSetting.email);

  const mailData = {
    from: { name: emailTemplate.fromName, address: emailTemplate.fromMail },
    html,
    to: email,
    subject: emailTemplate.subject,
  };

  await MailSender.send(mailData);
};

module.exports = { SendOtpMail, ResetPasswordSendOtpMail };
