function userCheck(req,res,next) {
    if (req.session.user == "Inidef") {
        return res.redirect("/");
    } else {
        return next();
    }
}

module.exports = userCheck;