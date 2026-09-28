// backend.js
import express from "express";
import cors from "cors";
import userServices from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));
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

  userServices
    .getUsers(name, job)
    .then((users) => {
      res.send({ users_list: users });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Could not retrieve users.");
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id

  userServices
    .findUserById(id)
    .then((user) => {
      if (user === null) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Could not retrieve user.");
    });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];

  userServices
    .removeUser(id)
    .then((deletedUser) => {
      if (deletedUser === null) {
        res.status(404).send("Resource not found.");
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Could not delete user.");
    });
});

app.post("/users", (req, res) => {
  const userToAdd = {
    name: req.body.name,
    job: req.body.job,
  };

  userServices
    .addUser(userToAdd)
    .then((newUser) => {
      res
        .status(201)
        .set("Location", `/users/${newUser._id}`)
        .send(newUser);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Could not create user.");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
