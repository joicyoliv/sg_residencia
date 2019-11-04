module.exports = {
  eComum: function (req, res, next) {
    if(req.isAuthenticated() && req.user.eAdmin == false) {
      return next();
    }

    req.flash("error_msg", "Você precisa ser um residente autenticado para acessar aquela página.")
    res.redirect("/")
  }
}
