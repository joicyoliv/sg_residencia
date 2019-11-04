module.exports = {
  eAdmin: function (req, res, next) {
    if(req.isAuthenticated() && req.user.eAdmin == true) {
      return next();
    }

    req.flash("error_msg", "Você precisa ser um servidor autenticado para acessar aquela página.")
    res.redirect("/")
  }
}
