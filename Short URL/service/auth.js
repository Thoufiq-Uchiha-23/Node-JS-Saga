// const sessionIdToUserMap = new Map();

// function setUser(id, user) {
//     sessionIdToUserMap.set(id, user);
// }

// function getUser(id) {
//     return sessionIdToUserMap.get(id);
// }

// module.exports = {
//     setUser,
//     getUser,
// }

// JWT Token Method
const jwt = require("jsonwebtoken");
const secret = "Thoufiq$123@$";

function setUser(user) {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
  );
}

function getUser(token) {
  if (!token) {
    console.log("No token provided");
    return null;
  }
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error("JWT Error:", error.message);
    return null;
  }
}

module.exports = { setUser, getUser };
