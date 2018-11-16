const mail = require('../handlers/mail');
const request = require('request');



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
  const captcha = req.body['g-recaptcha-response'];
  const secret = process.env.CAPTCHA_SECRET;
  const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;


  if (captcha === undefined || captcha === '' || captcha === null) {
    await req.flash('error', `Please tick the captcha box`);
    return res.redirect('/')
  }

  await request(verificationURL, async function(error, response, body) {
    body = JSON.parse(body);

    if(body.success !== undefined && !body.success) {
      await req.flash('error', `Please tick the captcha box`);
      return res.redirect('/')
    }

    if (body.success) {
      await mail.send({
        from: 'info@gjjames.co.uk',
        replyTo: email,
        to: 'gareth@gjjames.co.uk',
        subject: 'Website enquiry',
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
    
  })


  
}

exports.contactPageForm = async (req, res) => {
  const name = req.body.name.trim()
  const email = req.body.email.trim()
  const subject = req.body.subject.trim()
  const company = req.body.company.trim()
  const message = req.body.message

  const captcha = req.body['g-recaptcha-response'];
  const secret = process.env.CAPTCHA_SECRET;
  const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;

  if (captcha === undefined || captcha === '' || captcha === null) {
    await req.flash('error', `Please tick the captcha box`);
    return res.redirect('/stock1234/contact')
  }

  await request(verificationURL, async function(error, response, body) {
    body = JSON.parse(body);

    if(body.success !== undefined && !body.success) {
      await req.flash('error', `Please tick the captcha box`);
      return res.redirect('/stock1234/contact')
    }

    if (body.success) {
      await mail.send({
        from: 'info@gjjames.co.uk',
        replyTo: email,
        to: 'gareth@gjjames.co.uk',
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
    
  })
  
}