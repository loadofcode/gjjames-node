/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/
const fs = require('fs');

// moment.js is a handy library for displaying dates
exports.moment = require('moment');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// Making a static map is really long - this is a handy helper function to make one
exports.staticMap = ([lng, lat]) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${process.env.MAP_KEY}&markers=${lat},${lng}&scale=2`;

// inserting an SVG
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

// Some details about the site
exports.siteName = `gjjames.co.uk`;

exports.menu = [
  { slug: '/products', title: 'Products', icon: 'store', },

  { slug: '/contact', title: 'Contact', icon: 'pencil', },
  // { slug: '/admin/add-product', title: 'Add', icon: 'add', }
];
