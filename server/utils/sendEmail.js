const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // or your email provider
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // your email password or app password
    },
  });

  // Email options
  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
