const Model = require("../models/emailTemplate.model");
const SiteSettingModel = require("../models/siteSetting.model");
const { MailSender } = require("../config/mailer");
const { EmailTemplateCodeEnum } = require("../helper/typeConfig");

const SendEnquiryforAdminEmail = async ({ email, subject, message, phone, phoneCode }) => {
  const emailTemplate = await Model.findOne({
    code: EmailTemplateCodeEnum.HELP,
    deletedAt: null,
    mailFor: "admin"
  });
  if (!emailTemplate)
    throw new Error(
      "Email template not Found on this Code " +
        EmailTemplateCodeEnum.HELP
    );

  const SiteSetting = await SiteSettingModel.findOne().lean();

  let html = emailTemplate.content
    .replaceAll("{%APP_NAME%}", SiteSetting.title)
    .replaceAll("{%USER_EMAIL%}", email)
    .replaceAll("{%ENQUIRY_TITLE%}", subject)
    .replaceAll("{%ENQUIRY_MESSAGE%}", message)
    .replaceAll("{%PHONE_NUMBER%}", phone)
    .replaceAll("{%PHONE_CODE%}", phoneCode)
    .replaceAll("{%LOGO%}", process.env.BASE_URL+SiteSetting.logo.url);

  const mailData = {
    from: { name: emailTemplate.fromName, address: emailTemplate.fromMail },
    html,
    to: emailTemplate.toMail,
    subject: emailTemplate.subject,
  };

  await MailSender.send(mailData);
};

const SendEnquiryforUserEmail = async ({ email, subject, message, phone, phoneCode }) => {
    const emailTemplate = await Model.findOne({
      code: EmailTemplateCodeEnum.HELP,
      deletedAt: null,
      mailFor: "user"
    });
    if (!emailTemplate)
      throw new Error(
        "Email template not Found on this Code " +
          EmailTemplateCodeEnum.NOTIFICATION
      );
  
    const SiteSetting = await SiteSettingModel.findOne().lean();
  
    let html = emailTemplate.content
      .replaceAll("{%APP_NAME%}", SiteSetting.title)
      .replaceAll("{%USER_EMAIL%}", email)
      .replaceAll("{%ENQUIRY_TITLE%}", subject)
      .replaceAll("{%ENQUIRY_MESSAGE%}", message)
      .replaceAll("{%PHONE_NUMBER%}", phone)
      .replaceAll("{%PHONE_CODE%}", phoneCode)
      .replaceAll("{%LOGO%}", process.env.BASE_URL+SiteSetting.logo.url);
    const mailData = {
      from: { name: emailTemplate.fromName, address: emailTemplate.fromMail },
      html,
      to: email,
      subject: emailTemplate.subject,
    };
  
    await MailSender.send(mailData);
  };

module.exports = { SendEnquiryforAdminEmail, SendEnquiryforUserEmail };
