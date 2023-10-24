import sendEmail from "./sendEmail";

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  // change to front end url
  const verifyEmail = `${origin}/api/user/verify-email?token=${verificationToken}&email=${email}`;

  const message = `<p>Please confirm your email by clicking on the following link: <a href='${verifyEmail}'>verify email</a> </p>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello, ${name}</h4> ${message}`,
  });
};

export default sendVerificationEmail;
