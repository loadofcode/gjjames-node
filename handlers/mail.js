const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmltoText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// Example of a message 
// transport.sendMail({
//   from: 'Wes Bos',
//   to:'ggomersall@gmail.com',
//   subject: 'Just trying this out',
//   html:`Hey <strong>YOU</strong>, whats cracking`,
//   text:`Hey **YOU**, whats cracking`
// });

exports.send = async (options) => {
  const mailOptions = {
    from: options.user.email,
    to: 'ggomersall@gmail.com',
    subject: options.subject,
    html: 'This will be filled in later',
    text: 'This will also be filled in later'
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};