const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");

let phonebook = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "33-142-1346",
  },
];

const app = express();

app.use(express.json());
app.use(express.static("build"));
app.use(cors());
morgan.token("req-body", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return undefined;
});
const logger = morgan(
  ":method :url :status :response-time ms - :res[content-length] :req-body"
);
app.use(logger);
app.get("/api/persons", (req, res) => {
  Person.find({}).then((response) => {
    console.log(response);
    res.json(response);
  });
});

app.get("/info", (req, res) => {
  const time = new Date();
  res.end(
    `<h1>Phonebook has info for ${
      phonebook.length
    } people </h1> <h3>${time.toString()}</h3>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const idd = req.params.id;
  Person.findById(idd)
    .then((retunedPerson) => {
      console.log(retunedPerson);
      res.json(retunedPerson);
    })
    .catch((error) => {
      console.log("error", error.message);
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  let person = phonebook.filter((person) => person.id === id);
  if (person.length !== 0) {
    let p = person[0];
    phonebook = phonebook.filter((booker) => booker.id !== p.id);
    res.status(200);
    res.json(p);
  } else {
    res.status(404);
    res.end();
  }
});

app.post("/api/persons", (req, res) => {
  const content = req.body;
  if (!content.name) {
    return res.status(400).json({ error: "name missing" });
  }
  if (!content.number) {
    return res.status(400).json({ error: "number missing" });
  }

  const pers = new Person({
    name: content.name,
    number: content.number,
  });

  pers.save().then((responded) => {
    res.json(responded);
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server running on port", PORT);
});
