function userC3(req, res, next) {
  let user = req.session.user;
  if (user == "User1" || user == "User2") {
    return res.redirect("/");
  } else {
    return next();
  }
}

module.exports = userC3;
