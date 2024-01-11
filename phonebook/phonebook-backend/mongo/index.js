const mongoose = require('mongoose')
const Contact = require('./models/contact')
const { MONGO_URL } = require('../util/config')

if (MONGO_URL && !mongoose.connection.readyState) mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })


module.exports = {
  Contact
}
