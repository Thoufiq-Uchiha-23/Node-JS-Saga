const User = require("../models/user.models");

const handleGetAllDBUsers = async (req, res) => {
  const allDBUsers = await User.find({});

  return res.json(allDBUsers);
};

const handleGetUserById = async (req, res) => {
  // const id = Number(req.params.id);
  // const user = users.find((user) => user.id === id);

  // MONGO
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json(user);
};

const handleUpdateUserById = async (req, res) => {
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
  await User.findByIdAndUpdate(req.params.id, { lastName: "Changed" });
  return res.json({
    status: "Success",
    message: "User updated successfully",
  });
};

const handleDeleteUserById = async (req, res) => {
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
  await User.findByIdAndDelete(req.params.id);
  return res
    .status(200)
    .json({ status: "Success", message: "User deleted successfully" });
};

const handleCreateNewUser = async (req, res) => {
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
  });

  console.log("result", result);
  return res.status(201).json({ msg: "success", id: result._id });
};

module.exports = {
  handleGetAllDBUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
};
