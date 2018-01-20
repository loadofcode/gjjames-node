const mongoose = require('mongoose')

// Make sure we are running node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 7 || (major === 7 && minor <= 5)) {
    console.log('🛑 🌮 🐶 💪 💩\nHey You! \n\t ya you! \n\t\tBuster! \n\tYou\'re on an older version of node that doesn\'t support Async + Await! Please go to nodejs.org and download version 7.6 or greater. 👌\n ');
    process.exit();
}

require('dotenv').config({ path: 'variables.env' })

// connect to our DB and handle bad connections
// mongoose.connect(process.env.DATABASE)
mongoose.Promise = global.Promise // tell mongoose to use ES6 promises
const connection = mongoose.connect(process.env.DATABASE, {
    useMongoClient: true
}).then(db => {

}).catch(error => {
    console.log(error);
});

//  Ready lets go
require('./models/Product');
require('./models/Category');
require('./models/Tag');
require('./models/User');

// Start our App
const app = require('./app')
app.set('port', process.env.PORT || 3000)
const server = app.listen(app.get('port'), () => {
    console.log(`Express running -> PORT ${server.address().port}`)
})