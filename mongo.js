const mongoose = require('mongoose')

// Very basic input validation
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

if (process.argv.length > 5) {
  console.log('Please provide the name in quotes, if it contains more than one word.')
  process.exit(1)
}

// Connecion information
const password = process.argv[2]

const url =
  `mongodb+srv://fullstack1:${password}@mongonode1.i2vqw.mongodb.net/phonebook-app?retryWrites=true&w=majority`
mongoose.connect(url)

// Schema definitions
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

// Insertion
if(process.argv.length > 3) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(() => {
    console.log(`added ${name} with number ${number} to phonebook`)
    mongoose.connection.close()
  })

}else{
// Listing
  Person.find({ }).then(result => {
    result.forEach(person => {
      console.log(`${person.name} : ${person.number}`)
    })
    mongoose.connection.close()
  })
}
