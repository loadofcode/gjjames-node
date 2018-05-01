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

exports.websiteEnquiry = async (req, res) => {
  const name = req.body.name.trim()
  const email = req.body.email.trim()
  const telephone = req.body.phone.trim()
  const company = req.body.company.trim()
  const message = req.body.message
  console.log(checkbox)
  await mail.send({
      from: 'info@gjjames.co.uk',
      replyTo: email,
      to: 'ggomersall@gmail.com',
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