exports.homePage = (req, res) => {
  res.render('index', { title: 'Home' });
};

exports.adminPage = (req, res) => {
  res.render('admin', { title: 'Admin' });
};

exports.emailPage = (req, res) => {
  res.render('email', {title: 'Email Us' });
}