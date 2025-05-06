const { getUser } = require("../service/auth.js");

function checkForAuthentication(req, res, next) {
  // AUTH WAY
  //   const authorizationHeaderValue = req.cookies?.token;
  //   req.user = null;
  //   if (
  //     !authorizationHeaderValue ||
  //     !authorizationHeaderValue.startsWith("Bearer ")
  //   )
  //     return next();
  //  const token = authorizationHeaderValue.split("Bearer ")[1]; //Bearer 13519yy9gao95y0qy0

  //   TOKEN WAY
  const tokenCookie = req.cookies?.token;
  const token = tokenCookie;
  
  const user = getUser(token);

  req.user = user;
  return next();
}

function restrictTo(roles) {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login");

    if (!roles.includes(req.user.role)) return res.end("UnAuthorized");
  };

  return next();
}

module.exports = {
  checkForAuthentication,
  restrictTo,
};
