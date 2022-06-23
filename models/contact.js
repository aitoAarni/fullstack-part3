const mongoose = require('mongoose')
require('dotenv').config()


console.log('connecting to ', process.env.DB_URL)

mongoose.connect(process.env.DB_URL)
    .then(result => console.log('connected to MNongoloidDB'))
    .catch((error) => console.log('error detectedi: ', error.message))


const noteSchema = new mongoose.Schema({name: String, number: String})


noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    }
})


module.exports = mongoose.model('Contact', noteSchema)