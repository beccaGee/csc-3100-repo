// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";


function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(id) {
  fetch(`http://localhost:8000/users/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.status === 204) {
        const updated = characters.filter(
          (character) => character.id !== id,
        );

        setCharacters(updated);
      } else if (response.status === 404) {
        console.log("User was not found.");
      } else {
        console.log("User was not deleted. Status:", response.status);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          console.log("User was not created. Status:", response.status);
        }
      })
      .then((newUser) => {
        if (newUser) {
          setCharacters([...characters, newUser]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUsers() {
    return fetch("http://localhost:8000/users");
  }

  function postUser(person) {
    return fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;