function user2(req,res,next) {
    let user = req.session.user;
    if (user == "User1") {
        return res.redirect("/");
    } else {
        return next();
    }
}

module.exports = user2;