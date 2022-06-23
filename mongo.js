const mongoose = require('mongoose')
require('dotenv').config()


console.log('connecting to ', process.env.DB_URL)

mongoose.connect(process.env.DB_URL)
    .then(result => console.log('connected to MNongoloidDB'))
    .catch((error) => console.log('error detectedi: ', error.message))


const noteSchema = new mongoose.Schema({name: String, number: String})

const Contact = mongoose.model('Contact', noteSchema)

if (process.argv[2] && process.argv[3]) {
    const contact = new Contact({
        name: process.argv[2],
        number: process.argv[3]
    })
    contact.save().then(result => {
        console.log('Contact saved')
        mongoose.connection.close()
    })
}
else {
    Contact.find({}).then(cont => {cont.forEach(info => {
        console.log(info)
        })
        mongoose.connection.close()
    })
}
return