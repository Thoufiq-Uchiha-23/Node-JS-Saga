const express = require("express");
// const users = require("./MOCK_DATA.json");
const fs = require("fs");
const mongoose = require("mongoose");
const { type } = require("os");
const app = express();
const PORT = 8000;

// Connection
mongoose
  .connect("mongodb://0.0.0.0/youtube-app-1")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("Mongo Error", err);
  });

// Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  jobTitle: {
    type: String,
  },
});

const User = mongoose.model("user", userSchema);

// Middlewares - Plugins
app.use(express.urlencoded({ extended: false }));

// MIDDLEWARE - Plugin
app.use((req, res, next) => {
  // console.log("Hello from Middleware 1")
  fs.appendFile(
    "./log.txt",
    `\n ${Date.now()} ${req.method} ${req.ip} ${req.path}`,
    (err, data) => {
      next();
    }
  );
});

app.use((req, res, next) => {
  console.log("Hello from Middleware 2");
  next();
});

// ROUTES
app.get("/users", async (req, res) => {
  const allDBUsers = await User.find({})
  const html = `
  <ul>
  ${allDBUsers.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
  </ul>
  `;
  return res.send(html);
});

// REST API
app.get("/api/users", async (req, res) => {
  const allDBUsers = await User.find({})

  return res.json(allDBUsers);
});

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    // const id = Number(req.params.id);
    // const user = users.find((user) => user.id === id);

    // MONGO
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  })
  .put(async (req, res) => {
    // const id = Number(req.params.id);
    // const body = req.body;

    // Find user Index
    // const userIndex = users.findIndex((user) => user.id === id);

    // if (userIndex === -1) {
    //   return res
    //     .status(404)
    //     .send({ status: "error", message: "User not found" });
    // }

    // // Upgrade only the provided fields
    // const updatedUser = { ...users[userIndex], ...body };
    // users[userIndex] = updatedUser;
    // console.log("Updated User", users[userIndex]);

    // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
    //   if (err) {
    //     console.error("Write error:", err); // Debug log
    //     return res
    //       .status(500)
    //       .send({ status: "error", message: "Failed to update user" });
    //   }

    //   console.log("File successfully updated"); // Debug log
    //   return res.send({ status: "success", id: id, user: users[userIndex] });
    // });

    // MONGO
    await User.findByIdAndUpdate(req.params.id, {lastName:"Changed"})
    return res.json({status: "Success", message: "User updated successfully"})
  })
  .delete(async (req, res) => {
    // const id = Number(req.params.id);
    // const body = req.body;

    // // Find user Index
    // const userIndex = users.findIndex((user) => user.id === id);
    // if (userIndex === -1) {
    //   return res
    //     .status(404)
    //     .send({ status: "error", message: "User not found" });
    // }

    // // Store the deleted user for potential rollback
    // const deletedUser = users[userIndex];

    // console.log(
    //   `User ${id} removed from memory. New user count: ${users.length}`
    // );

    // // Remove the user
    // users.splice(userIndex, 1);

    // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
    //   if (err) {
    //     console.error("File write error:", err);
    //     // Rollback the deletion in memory
    //     users.splice(userIndex, 0, deletedUser);
    //     return res.status(500).send({
    //       status: "error",
    //       message: "Failed to delete user from file",
    //       error: err.message,
    //     });
    //   }

    //   console.log(`User ${id} successfully deleted from file`);
    //   return res.send({
    //     status: "success",
    //     id: id,
    //     message: "User deleted successfully",
    //     deletedUser: deletedUser, // Optional: return the deleted user data
    //   });
    // });

    // MONGO
    await User.findByIdAndDelete(req.params.id)
    return res.status(200).json({status: "Success", message: "User deleted successfully"})
  });

// app.get("/api/users/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const user = users.find((user) => user.id === id);

//   return res.json(user);
// });

app.post("/api/users", async (req, res) => {
  const body = req.body;
  console.log("Body", body);

  if (
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).send({ message: "All fields are req..." });
  }
  // users.push({ ...body, id: users.length + 1 });
  // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
  //   return res.status(201).send({ status: "success", id: users.length });
  // });

  // MONGO method
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  })

  console.log("result", result)
  return res.status(201).json({msg: "success"})
});

// app.patch("/api/users/:id", (req, res) => {
//   // TODO: Edit the user with id
//   return res.json({ status: "pending" });
// });

// app.delete("/api/users/:id", (req, res) => {
//   // TODO: Delete the user with id
//   return res.json({ status: "pending" });
// });

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
