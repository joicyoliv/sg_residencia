const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const enviar_email = require("./email")

/* CARREGANDO MODELS */
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
require("../models/Servidor")
const Servidor = mongoose.model("servidores")


/* ROTAS */

/* Gerencia de servidores */
router.get("/", (req, res) => {
  Servidor.find().populate("usuario").sort({criacao: "desc"}).then((servidores) => {
    res.render("servidor/servidores", {servidores: servidores})
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar listar os servidores: " + err)
    res.redirect("/servidor")
  })
})

router.get("/deletar/:iduser/:idserv", (req, res) => {
  Servidor.deleteOne({_id: req.params.idserv}).then(() => {
    Usuario.deleteOne({_id: req.params.iduser}).then(() => {
      req.flash("success_msg", "Servidor deletado com sucesso")
      res.redirect("/servidor/servidores")
    }).catch((err) => {
      req.flash("error_msg", "Erro ao tentar encontrar usuario de residente: " + err)
      res.redirect("/servidor/servidores")
    })
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar encontrar servidor: " + err)
    res.redirect("/servidor/servidores")
  })
})

/* abre formulario de cadastro de servidor */
router.get("/adicionar", (req, res) => {
    res.render("servidor/addservidor")
})

/* cadastra a residente no banco */
router.post("/adicionar", (req, res) => {
  var erros = []

  //validando matricula
  Usuario.findOne({matricula: req.body.matricula}).then((usuario) => {
    if(usuario != null) {
      erros.push({texto: "Usuario com matrícula " + req.body.matricula + " já existe"})
      res.render("servidor/addservidor", {erros: erros})
    } else {
      //matricula validada --- cadastrar usuario

      //cadastra usuario
      const novoUsuario = {
        nome: req.body.nome,
        cpf: req.body.cpf,
        matricula: req.body.matricula,
        email: req.body.email,
        sexo: req.body.sexo,
        endereco: req.body.endereco,
        eAdmin: true
      }

      new Usuario(novoUsuario).save().then((lastUsuario) => {
        const novoServidor = {
          cargo: req.body.cargo,
          usuario: lastUsuario._id
        }

        new Servidor(novoServidor).save().then((lastServidor) => {

          var assunto_email = "Bem vindo ao SGR! Registre sua senha"
          var corpo_email = "<div style='text-align: center; font-family: sans-serif; border: 1px solid gray; border-radius: 25px; padding: 20px; margin: 0px 50px 20px 50px;'>"
          corpo_email += "<h2>" + req.body.nome + ", bem vindo(a) ao Sistema de Gerenciamento de Residentes</h2>"
          corpo_email += "<h3>Você foi adicionado ao nosso sistema como um servidor que possa administrar os residentes e suas solicitações de  serviços.<br><br>"
          corpo_email += "Defina sua senha visitando o link: localhost:8082/usuario/definir_senha/"+lastUsuario._id+" <br><br>"
          corpo_email += "Após fazer isto, você poderá autenticar-se no sistema com sua matrícula e senha!</h3></div>"
          enviar_email(req.body.email, assunto_email, corpo_email)
          req.flash("success_msg", "Servidor adicionado com sucesso! Um e-mail foi enviado para que ele(a) registre sua senha")
          res.redirect("/servidor/servidores")
        }).catch((err) => {
          req.flash("error_msg", "Erro ao tentar adicionar servidor: " + err)
          res.redirect("/servidor/servidores")
        })
      }).catch((err) => {
        req.flash("error_msg", "Erro ao tentar adicionar servidor: " + err)
        res.redirect("/servidor/servidores")
      })
      // fim cadastro usuario
    }
  })
})

module.exports = router
