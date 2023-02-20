const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}
const password = process.argv[2];
const url = `mongodb+srv://maxperala:${password}@fullstackopen.5uebbur.mongodb.net/Puhelinluettelo?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const henkiloSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = new mongoose.model("Person", henkiloSchema);

if (process.argv.length === 5 || process.argv.length === 4) {
  const henkilo = new Person({
    name: process.argv[3],
    number: process.argv[4] || "number missing",
  });
  henkilo.save().then((result) => {
    console.log(`added ${result.name} number: ${result.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((persons) => {
    console.log("phonebook: ");
    persons.forEach((person) => {
      console.log(person.name, " ", person.number);
    });
    mongoose.connection.close();
  });
}
