const nodemailer = require("nodemailer");
const { logger } = require("../utils/logger");

const transporter = async () => {
  const tr = await nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  tr.verify(function (error, success) {
    if (error) {
      logger.error(error.stack);
      throw error;
    }
  });

  return tr;
};

const send = async (params) => {
  if (!params) throw new Error("Mail Params is not define");
  const transport = await transporter();
  const info = await transport.sendMail(params);
  return info.messageId;
};

module.exports = { MailSender: { send, transporter } };
