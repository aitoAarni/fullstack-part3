const mongoose = require('mongoose')
require('dotenv').config()


console.log('connecting to ', process.env.DB_URL)

mongoose.connect(process.env.DB_URL)
    .then(result => console.log('connected to MNongoloidDB'))
    .catch((error) => console.log('error detectedi: ', error.message))


const validator = (val) => {
    if (val.length >= 8){
        console.log('is length 8')
        console.log('val[2] ===  "-": ',val[2] ===  "-", '      !isNaN(val.slice(0, 2)): ', !isNaN(val.slice(0, 2)), '    !isNaN(val.slice(3)): ', !isNaN(val.slice(3)))
        if (val[2] ===  "-" && !isNaN(val.slice(0, 2)) && !isNaN(val.slice(3))) {
            return true
        }
        else if (val[3] ===  "-" && !isNaN(val.slice(0, 3)) && !isNaN(val.slice(4))) {
            return true
        }
    }
    return false
}

const custom = [validator, "Number must be approporiate (min 8) length and have a '-' after 2 or 3 numbers"]

const noteSchema = new mongoose.Schema({
    name: {type: String, minlength: 3, required: true},
    number: {type: String, validate: custom, required: true}
})


noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    }
})


module.exports = mongoose.model('Contact', noteSchema)