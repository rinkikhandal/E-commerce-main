import nodemailer from "nodemailer";
import nodemailerConfig from "./nodemailer.config";

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);
  const info = await transporter.sendMail({
    from: "do not reply", // sender address
    to,
    subject,
    html,
  });
};

export default sendEmail;
