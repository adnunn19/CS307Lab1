import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = 8000;

app.use(cors())
app.use(express.json());

mongoose.set("debug", true);

mongoose
  .connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    job: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 2)
          throw new Error("Invalid job, must be at least 2 characters.");
      },
    },
  },
  { collection: "users_list" }
);

const User = mongoose.model("User", UserSchema);

function getUsers(name, job) {
  let promise;
  if (name === undefined && job === undefined) {
    promise = userModel.find();
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = findUserByJob(job);
  }
  return promise;
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

app.get('/users', async (req, res) => {
    const { name, job } = req.query;
    if (job != undefined && name != undefined){
        // if both job and name are defined
        users = await userModel.find({ name: name, job: job});
    }
    else if (job != undefined){
        // if only job is defined
        users = await userModel.find({ job: job });
    }
    else if (name != undefined){
        // if only name is defined
        users = await userModel.find({ name: name });
    }
    else{
        // if neither job and name are defined
        users = await userModel.find();
    }
    res.send({ users_list: users });
});

app.get("/users/:id", (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});
  
app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    let newPerson = findUserByName(userToAdd.name);
    if (newPerson === undefined){
      // found error code 417, "expectation failed"
        res.status(417).send("Person was unable to be added")
    }
    res.status(204).send(newPerson);
});

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

export default User;