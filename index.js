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

const handleError = (error, request, response, next) => {
  if (error.name === "CastError") {
    response.status(400).json({ error: "bad request" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

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
  Person.find({}).then((response) => {
    res.end(
      `<h1>Phonebook has info for ${
        response.length
      } people </h1> <h3>${time.toString()}</h3>`
    );
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const idd = req.params.id;
  Person.findById(idd)
    .then((retunedPerson) => {
      console.log(retunedPerson);
      res.json(retunedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  Person.findByIdAndRemove(id)
    .then((response) => {
      res.status(200).send();
      console.log(response, "deleted");
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
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

  pers
    .save()
    .then((responded) => {
      res.json(responded);
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT || 3001;
app.use(handleError);
app.listen(PORT, () => {
  console.log("server running on port", PORT);
});
