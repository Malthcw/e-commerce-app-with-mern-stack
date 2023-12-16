const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (data, req, res) => {
try {
    const msg = {
      to: data.to,
      from: 'cmalith383@gmail.com', // Replace with your sender email
      subject: data.subject,
      text: data.text,
      html: data.html,
    };
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
});

module.exports = sendEmail;
