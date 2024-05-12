const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {    console.log('connected to MongoDB')  })  .catch(error => {    console.log('error connecting to MongoDB:', error.message)  })
const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3, // Ensure name is at least three characters long
      required: true
    },
    number: {
      type: String,
      required: true,
      validate: {
        validator: function(value) {
          const phoneRegex = /^(?:\d{3}-\d{5,}|\d{2}-\d{6,})$/;
          return phoneRegex.test(value);
        },
        message: props => `${props.value} is not a valid phone number. Phone number must have length of 8 or more and be in the format "XX-XXXXXXX" or "XXX-XXXXXXXX".`
      }
    }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)