const {getUser} = require("../service/auth.js")

async function restrictToLoggedinUserOnly(req, res, next) {
    // const userUid = req.cookies?.uid;
    
    if(!userUid) return res.redirect("/login")
    
    const user = getUser(userUid)
    

    if(!user) return res.redirect("/login")
    
    req.user = user
    next();
}

async function checkAuth(req, res, next) {
    // const userUid = req.cookies?.uid;
    const userUid = req.headers?.['authorization']
    const token = userUid.split('Bearer ')[1] //Bearer 13519yy9gao95y0qy0
    // const user = getUser(userUid)
    const user = getUser(token)
    req.user = user
    next();
}

module.exports = {
    restrictToLoggedinUserOnly,
    checkAuth,
}