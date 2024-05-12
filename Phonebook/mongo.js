const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://tonisprtl:${password}@cluster0.lsh6iea.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const addPerson = (name, number) => {
    const person = new Person({ name, number });
  
    person.save().then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`);
      mongoose.connection.close();
    })
};
  
const name = process.argv[3];
const number = process.argv[4];
addPerson(name, number);

Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
});

const displayPhonebook = () => {
    Person.find({}).then(result => {
      console.log('phonebook:');
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    });
  };
  
  if (process.argv.length === 3) {
    displayPhonebook();
  } else if (process.argv.length === 5) {
    const name = process.argv[3];
    const number = process.argv[4];
    addPerson(name, number);
  } else {
    console.log('Usage: node mongo.js <password> [<name> <number>]');
    process.exit(1);
  }