const express = require("express");

const router = express.Router();
const {
  handleGetAllDBUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
} = require("../controllers/users.controller");

// ROUTES
router.get("/", async (req, res) => {
  const allDBUsers = await User.find({});
  const html = `
    <ul>
    ${allDBUsers
      .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
      .join("")}
    </ul>
    `;
  return res.send(html);
});

router.get("/", handleGetAllDBUsers);

router
  .route("/:id")
  .get(handleGetUserById)
  .put(handleUpdateUserById)
  .delete(handleDeleteUserById);

// router.get("/api/users/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const user = users.find((user) => user.id === id);

//   return res.json(user);
// });

router.post("/", handleCreateNewUser);

module.exports = router;
