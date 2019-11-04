
//AÇÕES QUE SÃO TANTO DE USUARIO SERVIDOR COMO RESIDENTE
const express = require("express")
const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")
const passport = require("passport")
const router = express.Router()

/* CARREGANDO MODELS */
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

/* ROTAS */
router.get("/login", (req, res) => {
  res.render("login")
})

router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})


router.post("/login", (req, res, next) => {
  Usuario.findOne({matricula: req.body.matricula}).then((usuario) => {
    if(usuario) {
      //redireciona pra autenticação de servidor
      if(usuario.eAdmin) {
        passport.authenticate("local", {
          successRedirect: "/servidor",
          failureRedirect: "/usuario/login",
          failureFlash: true
        })(req, res, next)
      //redireciona pra autenticação de residente
      } else {
        passport.authenticate("local", {
          successRedirect: "/residente",
          failureRedirect: "/usuario/login",
          failureFlash: true
        })(req, res, next)
      }

    //redireciona pra qualquer uma autenticação
    } else {
      passport.authenticate("local", {
        successRedirect: "/residente",
        failureRedirect: "/usuario/login",
        failureFlash: true
      })(req, res, next)
    }
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar encontrar usuário: " + err)
    res.redirect("usuario/login")
  })
})

router.get("/definir_senha/:id", (req, res) => {
  Usuario.findOne({_id: req.params.id}).then((usuario) => {
    res.render("definirsenha", {usuario: usuario})
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar encontrar usuário: " + err)
    res.redirect("usuario/login")
  })
})

router.post("/definir_senha", (req, res) => {
  var erros = []

  if(req.body.senha != req.body.confirmacao) {
    erros.push({texto: "As senhas estão diferentes"})
  }

  if(erros.length > 0) {
    Usuario.findOne({_id: req.body.id}).then((usuario) => {
      res.render("definirsenha", {usuario: usuario, erros: erros})
    }).catch((err) => {
      req.flash("error_msg", "Erro ao tentar encontrar usuário: " + err)
      res.redirect("/")
    })
  } else {
    Usuario.findOne({_id: req.body.id}).then((usuario) => {
      usuario.senha = req.body.senha

      bcryptjs.genSalt(10, (erro, salt) => {
         bcryptjs.hash(usuario.senha, salt, (erro, hash) => {
           if(erro){
             req.flash("error_msg", "Houve um erro ao tentar adicionar hash na senha: " + err)
             res.redirect("/")
           }

           //se nao houver erro, salva a senha
           usuario.senha = hash

           usuario.save().then(() => {
             req.flash("success_msg", "Senha definida com sucesso. Agora você pode logar-se")
             res.redirect("/usuario/login")
           }).catch((err) => {
             req.flash("error_msg", "Erro ao tentar salvar a senha: " + err)
             res.redirect("/")
           })
         })
      })

    }).catch((err) => {
      req.flash("error_msg", "Erro ao tentar buscar usuario para adicionar senha: " + err)
      res.redirect("/")
    })
  }
})

module.exports = router
