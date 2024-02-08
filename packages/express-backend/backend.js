import express from "express";
import cors from "cors";

import userServices from "./user-services.js";

const app = express();
const port = 8000;

app.use(cors())
app.use(express.json());

// const genRandomID = () => Math.floor(Math.random()*100000)

app.get('/users', async (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    try{
      const result = await userServices.getUsers(name, job);
      res.send({ users_list: result });
    } catch (error){
      console.log(error);
      res.status(500).send("An error has occurred in the server.");
    }
});

app.get("/users/:id", async (req, res) => {
    const id = req.params['id']; //or req.params.id
    const result = await userServices.findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send({ users_list: result });
    }
});
  
app.post("/users", async (req, res) => {
    const userToAdd = req.body;
    const newPerson = await userServices.addUser(userToAdd);
    if (newPerson === undefined){
      // found error code 417, "expectation failed"
        res.status(417).send("Person was unable to be added")
    }
    res.status(204).send(newPerson);
});

app.delete('/users/:id', async (req, res) => {
    const id = req.params['id'];
    try{
      await userServices.deleteUser(id);
      res.send();
    } catch (error){
      res.status(500).send(error.message);
    }
});

app.delete('/users', async (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    // takes in both name and job for the deletion process
    // url will look like: /users?name='name'&job='job'
    try{
      const users = await userServices.findUserByName(name);
      const usersToDelete = users.filter(user => user.job === job);
      await userServices.deleteUserMany(usersToDelete);
      res.send()
    }
    catch (error){
      res.status(500).send(error.message);
    }
});


app.get("/", (req, res) => {
    res.send("Hello World!");
  });

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});