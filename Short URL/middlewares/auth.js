const { getUser } = require("../service/auth.js");

function checkForAuthentication(req, res, next) {
  const authorizationHeaderValue = req.headers["authorization"];
  req.user = null;
  if (
    !authorizationHeaderValue ||
    !authorizationHeaderValue.startsWith("Bearer ")
  )
    return next();

    const token = authorizationHeaderValue.split("Bearer ")[1]; //Bearer 13519yy9gao95y0qy0
    const user = getUser(token)

    req.user = user;
    return next();
}

module.exports = {
  checkForAuthentication,
};
