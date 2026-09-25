// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello EVERYONE!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name != undefined && job !== undefined) {
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  } else if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];

  const findUserIndex = users.users_list.findIndex((user) => user.id === id);

  if (findUserIndex === -1) {
    res.status(404).send("Resource not Found.");
    return;
  }

  users.users_list.splice(findUserIndex, 1);

  res.status(204).send();
});

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

function generateId() {
  const alph = "abcdefghijklmnopqrstuvwxyz";
  const letters =
    alph[Math.floor(Math.random() * 26)] +
    alph[Math.floor(Math.random() * 26)] +
    alph[Math.floor(Math.random() * 26)];

  const nums = Math.floor(100 + Math.random() * 900);

  return `${letters}${nums}`;
}

app.post("/users", (req, res) => {
  const userToAdd = {
    id: generateId(),
    name: req.body.name,
    job: req.body.job,
  };

  addUser(userToAdd);

  res.status(201).set("Location", `/users/${userToAdd.id}`).send(userToAdd);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user.job === job,
  );
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};
