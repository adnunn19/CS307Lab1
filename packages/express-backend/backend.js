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

const deleteUser = async (id) => {
  await userModel.deleteOne({ id: id });
}
  

app.get('/users', async (req, res) => {
    const { name, job } = req.query;
    if (job != undefined && name != undefined){
        // if both job and name are defined
        users = await findUserByName(name);
        users = users.filter((user) => user.job === job);
    }
    else if (job != undefined){
        // if only job is defined
        users = await findUserByJob(job);
    }
    else if (name != undefined){
        // if only name is defined
        users = await findUserByName(name);
    }
    else{
        // if neither job and name are defined
        users = await userModel.find();
    }
    res.send({ users_list: users });
});

app.get("/users/:id", async (req, res) => {
    const id = req.params['id']; //or req.params.id
    const user = await findUserById(id);
    if (result === undefined) {
        res.status(404).send("User not found.");
    } else {
        res.send(user);
    }
});
  
app.post("/users", async (req, res) => {
    const userToAdd = req.body;
    let newPerson = await addUser(addToUser);
    if (newPerson === undefined){
      // found error code 417, "expectation failed"
        res.status(417).send("Person was unable to be added")
    }
    res.status(204).send(newPerson);
});

app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    await deleteUser(id);
    res.send();
});

app.delete('/users', async (req, res) => {
    const { name, job } = req.query;
    // takes in both name and job for the deletion process
    // url will look like: /users?name='name'&job='job'
    const person = findUserByName(name);
    if (person.length === 0) {
        res.status(404).send("User not found");
        return;
    }
    // await userModel.deleteMany({ name: name, job: job });
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