const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
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
  res.json(phonebook);
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
  const id = Number(req.params.id);
  const person = phonebook.filter((person) => person.id === id);
  if (person.length !== 0) {
    console.log(person);
    res.status(200);
    res.json(person);
  } else {
    console.log("error!");
    res.status(404).end();
  }
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

  for (person of phonebook) {
    // console.log(person);
    if (person.name === content.name) {
      return res.status(400).json("name already in phonebook");
    }
  }

  const note = {
    id: Math.trunc(Math.random() * 500),
    name: content.name,
    number: content.number,
  };
  phonebook = phonebook.concat(note);
  res.json(note);
});

const port = 3001;

app.listen(port, () => {
  console.log("server running on port", port);
});
