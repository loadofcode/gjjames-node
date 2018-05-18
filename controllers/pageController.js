const mail = require('../handlers/mail');

exports.homePage = (req, res) => {
  res.render('index', { title: 'Home' });
};

exports.adminPage = (req, res) => {
  res.render('admin', { title: 'Admin' });
};

exports.emailPage = (req, res) => {
  res.render('email', {title: 'Email Us' });
}

exports.privacyPage = (req, res) => {
  res.render('privacy-policy', {title: 'Privacy Policy'});
}

exports.contactPage = (req, res) => {
  res.render('contact', {title: 'Contact Us'});
}

exports.websiteEnquiry = async (req, res) => {
  const name = req.body.name.trim()
  const email = req.body.email.trim()
  const telephone = req.body.phone.trim()
  const company = req.body.company.trim()
  const message = req.body.message
  await mail.send({
      from: 'info@gjjames.co.uk',
      replyTo: email,
      to: 'gareth@gjjames.co.uk',
      subject: 'Product enquiry',
      email,
      name,
      telephone,
      company,
      message,
      filename: 'website-enquire'
    })
  req.flash('success', `Thank you for contacting us, we'll be in touch soon`);
  res.redirect('/');
}

exports.contactPageForm = async (req, res) => {
  const name = req.body.name.trim()
  const email = req.body.email.trim()
  const subject = req.body.subject.trim()
  const company = req.body.company.trim()
  const message = req.body.message
  await mail.send({
      from: 'info@gjjames.co.uk',
      replyTo: email,
      to: 'ggomersall@gmail.com',
      subject: subject,
      email,
      name,
      company,
      message,
      filename: 'contact-page-form'
    })
  req.flash('success', `Thank you for contacting us, we'll be in touch soon`);
  res.redirect('/stock1234/contact');
}