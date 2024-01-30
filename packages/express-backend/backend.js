import express from "express";

const app = express();
const port = 8000;

app.use(express.json());

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
        person = result.filter((user) => user['job'] === job);
        person = {users_list: result};
        res.send(result);
    }
    else if (job != undefined){
        // if only job is defined
        let result = users['users_list'].filter((user) => user['job'] === job);
        result = {users_list: result};
        res.send(result);
    }
    else if (name != undefined){
        // if only name is defined
        let result = findUserByName(name);
        result = {users_list: result};
        res.send(result);
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
    users["users_list"].push(user);
    return user;
};
  
app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.send();
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
    const result = findUserByName(name);
    if (result.length === 0) {
        res.status(404).send("User not found");
        return;
    }
    const userToDelete = result.find((user) => user['job'] === job);
    if (!userToDelete) {
        res.status(404).send("User not found with the specified job");
        return;
    }
    deleteUser(userToDelete['id']);
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