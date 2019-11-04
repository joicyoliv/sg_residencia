const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const {eAdmin} = require("../helpers/eAdmin")
const enviar_email = require("./email")

/* CARREGANDO MODELS */
require("../models/Residente")
const Residente = mongoose.model("residentes")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
require("../models/Residencia")
const Residencia = mongoose.model("residencias")
require("../models/Quarto")
const Quarto = mongoose.model("quartos")


/* ROTAS */

/* Gerencia de residentes */
router.get("/", eAdmin, (req, res) => {
  Residente.find().populate("usuario").populate("quarto").populate("residencia").sort({criacao: "desc"}).then((residentes) => {
    res.render("servidor/residentes", {residentes: residentes})
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar listar os residentes: " + err)
    res.redirect("/servidor")
  })
})

router.get("/deletar/:iduser/:idresi/:idquarto", eAdmin, (req, res) => {
  Residente.deleteOne({_id: req.params.idresi}).then(() => {
    Usuario.deleteOne({_id: req.params.iduser}).then(() => {
      Quarto.findOne({_id: req.params.idquarto}).then((quarto) => {
        //atualiza numero de membros do quarto apos deletar usuario
        quarto.membros = quarto.membros - 1,
        quarto.atualizacao = Date.now()

        quarto.save().then(() => {
          req.flash("success_msg", "Residente deletado com sucesso")
          res.redirect("/servidor/residentes")
        }).catch((err) => {
          req.flash("error_msg", "Erro ao tentar atualizar o numero de membros do quarto do residente deletado: " + err)
          res.redirect("/servidor/residentes")
        })
      })
    }).catch((err) => {
      req.flash("error_msg", "Erro ao tentar encontrar usuario de residente: " + err)
      res.redirect("/servidor/residentes")
    })
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar encontrar residente: " + err)
    res.redirect("/servidor/residentes")
  })
})

/* abre formulario de cadastro de residente */
router.get("/adicionar", eAdmin, (req, res) => {
  Residencia.find().populate({path: "quartos", model: Quarto}).sort({criacao: "desc"}).then((residencias) => {
    res.render("servidor/addresidente", {residencias: residencias})
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar listar as residentes: " + err)
    res.redirect("/servidor")
  })
})


/* cadastra a residente no banco */
router.post("/adicionar", eAdmin, (req, res) => {
  var erros = []

  /* busca quarto para validar */
  Quarto.findOne({_id: req.body.quarto}).populate("residencia").then((quarto) => {
    if(quarto.capacidade <= quarto.membros) {
      erros.push({texto: "O quarto selecionado já está cheio"})
    }

    if(quarto.sexo != req.body.sexo && quarto.sexo != "Misto") {
      erros.push({texto: "O quarto selecionado não permite residente do sexo " + req.body.sexo})
    }

    if(erros.length > 0) {
      Residencia.find().populate({path: "quartos", model: Quarto}).sort({criacao: "desc"}).then((residencias) => {
        res.render("servidor/addresidente", {residencias: residencias, erros: erros})
      }).catch((err) => {
        req.flash("error_msg", "Erro ao tentar listar as residencias: " + err)
        res.redirect("/servidor")
      })
    } else {
        //validando matricula
        Usuario.findOne({matricula: req.body.matricula}).then((usuario) => {
          if(usuario != null) {
            erros.push({texto: "Usuario com matrícula " + req.body.matricula + " já existe"})
            Residencia.find().populate({path: "quartos", model: Quarto}).sort({criacao: "desc"}).then((residencias) => {
              res.render("servidor/addresidente", {residencias: residencias, erros: erros})
            }).catch((err) => {
              req.flash("error_msg", "Erro ao tentar listar as residencias: " + err)
              res.redirect("/servidor")
            })
          } else {
            //matricula validada --- cadastrar usuario
              //atualiza numero de membros do quarto
            quarto.membros = quarto.membros + 1,
            quarto.atualizacao = Date.now()

            quarto.save().catch((err) => {
              req.flash("error_msg", "Erro ao tentar atualizar o numero de membros do quarto selecionado: " + err)
              res.redirect("/servidor/residentes")
            })

              //cadastra usuario
              const novoUsuario = {
                nome: req.body.nome,
                cpf: req.body.cpf,
                matricula: req.body.matricula,
                email: req.body.email,
                sexo: req.body.sexo,
                endereco: req.body.endereco
              }

              new Usuario(novoUsuario).save().then((lastUsuario) => {
                const novoResidente = {
                  renda: req.body.renda,
                  curso: req.body.curso,
                  matricula: req.body.matricula,
                  quarto: req.body.quarto,
                  residencia: req.body.residencia,
                  usuario: lastUsuario._id
                }

                new Residente(novoResidente).save().then((lastResidente) => {

                  var assunto_email = "Bem vindo ao SGR! Registre sua senha"
                  var corpo_email = "<div style='text-align: center; font-family: sans-serif; border: 1px solid gray; border-radius: 25px; padding: 20px; margin: 0px 50px 20px 50px;'>"
                  corpo_email += "<h2>" + req.body.nome + ", bem vindo(a) ao Sistema de Gerenciamento de Residentes</h2>"
                  corpo_email += "<h3>Você foi alocado no quarto <b>" + quarto.titulo + "</b> da Residência <b>" + quarto.residencia.nome + "</b>.<br> No nosso software você poderá solicitar e acompanhar serviços da sua residência.<br><br>"
                  corpo_email += "Defina sua senha visitando o link: localhost:8082/usuario/definir_senha/"+lastUsuario._id+" <br><br>"
                  corpo_email += "Após fazer isto, você poderá autenticar-se no sistema com sua matrícula e senha!</h3></div>"
                  enviar_email(req.body.email, assunto_email, corpo_email)
                  req.flash("success_msg", "Residente adicionado com sucesso! Um e-mail foi enviado para que ele(a) registre sua senha")
                  res.redirect("/servidor/residentes")
                }).catch((err) => {
                  req.flash("error_msg", "Erro ao tentar adicionar residente: " + err)
                  res.redirect("/servidor/residentes")
                })
              }).catch((err) => {
                req.flash("error_msg", "Erro ao tentar adicionar residente: " + err)
                res.redirect("/servidor/residentes")
              })
              // fim cadastro usuario
          }
        })
    }
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar encontrar o quarto selecionado para residente: " + err)
    res.redirect("/servidor/residentes")
  })
})

module.exports = router
