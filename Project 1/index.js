const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();
const PORT = 8000;

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
app.get("/users", (req, res) => {
  const html = `
  <ul>
  ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
  </ul>
  `;
  return res.send(html);
});

// REST API
app.get("/api/users", (req, res) => {
  res.setHeader("X-MyName", "Thoufiq");
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .put((req, res) => {
    const id = Number(req.params.id);
    const body = req.body;

    // Find user Index
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });
    }

    // Upgrade only the provided fields
    const updatedUser = { ...users[userIndex], ...body };
    users[userIndex] = updatedUser;
    console.log("Updated User", users[userIndex]);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error("Write error:", err); // Debug log
        return res
          .status(500)
          .send({ status: "error", message: "Failed to update user" });
      }

      console.log("File successfully updated"); // Debug log
      return res.send({ status: "success", id: id, user: users[userIndex] });
    });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const body = req.body;

    // Find user Index
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });
    }

    // Store the deleted user for potential rollback
    const deletedUser = users[userIndex];

    console.log(
      `User ${id} removed from memory. New user count: ${users.length}`
    );

    // Remove the user
    users.splice(userIndex, 1);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error("File write error:", err);
        // Rollback the deletion in memory
        users.splice(userIndex, 0, deletedUser);
        return res.status(500).send({
          status: "error",
          message: "Failed to delete user from file",
          error: err.message,
        });
      }

      console.log(`User ${id} successfully deleted from file`);
      return res.send({
        status: "success",
        id: id,
        message: "User deleted successfully",
        deletedUser: deletedUser, // Optional: return the deleted user data
      });
    });
  });

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(user);
});

app.post("/api/users", (req, res) => {
  const body = req.body;
  console.log("Body", body);
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.send({ status: "success", id: users.length });
  });
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
