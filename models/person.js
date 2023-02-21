const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB");
  });

const henkiloSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (v) => {
        if (v.length > 8) {
          return /^\d{2,3}-\d{6,12}$/.test(v);
        } else return false;
      },
      message: "Phonenumber not formatted correctly.",
    },
  },
});

henkiloSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = new mongoose.model("Person", henkiloSchema);

module.exports = Person;
