const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")

require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

module.exports = function(passport) {

  passport.use(new localStrategy({usernameField: "matricula", passwordField: "senha"}, (matricula, senha, done) => {

    Usuario.findOne({matricula: matricula}).then((usuario) => {
      if(!usuario) {
        return done(null, false, {message: "Esta matrícula não existe no sistema"})
      }

      bcryptjs.compare(senha, usuario.senha, (erro, conferem) => {
        if(conferem) {
          return done(null, usuario)
        } else {
          return done(null, false, {message: "Senha incorreta"})
        }
      })
    })

  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    Usuario.findById(id, (err, usuario) => {
      done(err, usuario)
    })
  })

}
