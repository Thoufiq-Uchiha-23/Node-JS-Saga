const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();
const PORT = 8000;

// Middlewares - Plugins
app.use(express.urlencoded({ extended: false }));

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
  res.json(users);
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
    const userIndex = users.find((users) => users.id === id);

    if (userIndex === -1) {
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });
    }

    // Upgrade only the provided fields
    users[userIndex] = { ...userIndex, ...body };

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        return res
          .status(500)
          .send({ status: "error", message: "Failed to update user" });
      }
      return res.send({ status: "success", id: id });
    });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const body = req.body;

    // Find user Index
    const userIndex = users.find((users) => users.id === id);
    if (userIndex === -1) {
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });
    }

    // Remove the user
    users.splice(userIndex, 1);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      if (err) {
        return res
          .status(500)
          .send({ status: "error", message: "Failed to delete user" });
      }
      return res.send({ status: "success", id: id });
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

app.patch("/api/users/:id", (req, res) => {
  // TODO: Edit the user with id
  return res.json({ status: "pending" });
});

app.delete("/api/users/:id", (req, res) => {
  // TODO: Delete the user with id
  return res.json({ status: "pending" });
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
