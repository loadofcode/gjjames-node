const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmltoText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
  const inline = juice(html);
  return inline
}

// exports.enquirySend = async (options) => {
//   const html = generateHTML(options.filename, options)
//   const text = htmltoText.fromString(html)
//   const enquireOptions = {
//     from: options.from,
//     replyTo: options.replyTo,
//     to: options.to,
//     subject: options.subject,
//     html,
//     text
//   }
//   const sendEnquiry = promisify(transport.sendMail, transport);
//   return sendEnquiry(enquireOptions);
// }

exports.send = async (options) => {
  const html = generateHTML(options.filename, options)
  const text = htmltoText.fromString(html)
  const mailOptions = {
    from: options.from,
    replyTo: options.replyTo || options.from,
    to: options.to,
    subject: options.subject,
    html,
    text
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};  