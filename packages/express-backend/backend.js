import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors())
app.use(express.json());

const genRandomID = () => Math.floor(Math.random()*100000)

const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Store Clerk"
      }
    ]
  };

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};

app.get('/users', (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if (job != undefined && name != undefined){
        // if both job and name are defined
        let person = findUserByName(name);
        person = person.filter((user) => user['job'] === job);
        person = {users_list: person};
        res.send(person);
    }
    else if (job != undefined){
        // if only job is defined
        let person = users['users_list'].filter((user) => user['job'] === job);
        person = {users_list: person};
        res.send(person);
    }
    else if (name != undefined){
        // if only name is defined
        let person = findUserByName(name);
        person = {users_list: person};
        res.send(person);
    }
    else{
        // if neither job and name are defined
        res.send(users);
    }
});

 
const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});

const addUser = (user) => {
    let newID = genRandomID().toString();
    user.id = newID
    users["users_list"].push(user);
    return user;
};
  
app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    let newPerson = findUserByName(userToAdd.name);
    if (newPerson === undefined){
      // found error code 417, "expectation failed"
        res.status(417).send("Person was unable to be added")
    }
    res.status(201).send(newPerson);
});

const deleteUser = (id) => {
    users['users_list'] = users['users_list'].filter((user) => user['id'] !== id);
}

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    deleteUser(id);
    res.send();
});

app.delete('/users', (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    // takes in both name and job for the deletion process
    // url will look like: /users?name='name'&job='job'
    const person = findUserByName(name);
    if (person.length === 0) {
        res.status(404).send("User not found");
        return;
    }
    const userDelete = person.find((user) => user['job'] === job);
    if (!userDelete) {
        res.status(404).send("User not found with the specified job");
        return;
    }
    deleteUser(userDelete['id']);
    res.send();
});


app.get("/", (req, res) => {
    res.send("Hello World!");
  });

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});