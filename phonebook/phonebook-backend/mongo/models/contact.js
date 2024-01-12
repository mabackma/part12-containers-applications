const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

module.exports = mongoose.model('Contact', contactSchema)