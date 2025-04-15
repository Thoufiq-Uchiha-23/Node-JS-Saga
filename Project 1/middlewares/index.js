const fs = require("fs");

function logReqRes(filename) {
  return (req, res, next) => {
    // console.log("Hello from Middleware 1")
    fs.appendFile(
      filename,
      `\n ${Date.now()} ${req.method} ${req.ip} ${req.path}`,
      (err, data) => {
        next();
      }
    );
  };
}


module.exports = { logReqRes };