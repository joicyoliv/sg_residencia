const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const {eAdmin} = require("../helpers/eAdmin")

/* CARREGANDO MODELS */
require("../models/Solicitacao")
const Solicitacao= mongoose.model("solicitacoes")

/* ROTAS */

/* Gerencia de solicitacoes */
router.get("/", eAdmin, (req, res) => {
  res.render("servidor/solicitacoes")
})

router.get("/pendentes", eAdmin, (req, res) => {
  Solicitacao.find({status: "Pendente"}).populate("solicitanteUsuario").populate("solicitanteResidencia").populate("solicitanteQuarto").then((solicitacoes) => {
    res.render("servidor/solicPendentes", {solicitacoes: solicitacoes})
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar Solicitações: " + err)
    res.redirect("/servidor/solicitacoes")
  })
})

router.get("/andamentos", eAdmin, (req, res) => {
  Solicitacao.find({status: "Andamento"}).populate("solicitanteUsuario").populate("solicitanteResidencia").populate("solicitanteQuarto").then((solicitacoes) => {
    res.render("servidor/solicAndamentos", {solicitacoes: solicitacoes})
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar Solicitações: " + err)
    res.redirect("/servidor/solicitacoes")
  })
})

router.get("/finalizadas", eAdmin, (req, res) => {
  Solicitacao.find({status: "Finalizada"}).populate("solicitanteUsuario").populate("solicitanteResidencia").populate("solicitanteQuarto").then((solicitacoes) => {
    res.render("servidor/solicFinalizadas", {solicitacoes: solicitacoes})
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar Solicitações: " + err)
    res.redirect("/servidor/solicitacoes")
  })
})

router.post("/atender", eAdmin, (req, res) => {
    Solicitacao.findOne({_id: req.body.id_solicitacao}).then((solicitacao) => {
      solicitacao.status = "Andamento",
      solicitacao.funcionario = req.body.funcionario,
      solicitacao.atualizacao = Date.now()

      solicitacao.save().then(() => {
        req.flash("success_msg", "Solicitação em andamento com sucesso")
        res.redirect("/servidor/solicitacoes/pendentes")
      }).catch((err) => {
        req.flash("error_msg", "Erro ao tentar salvar a edição da solicitacao: " + err)
        res.redirect("/servidor/solicitacoes")
      })
    }).catch((err) => {
      req.flash("error_msg", "Erro ao tentar encontrar solicitacao: " + err)
      res.redirect("/servidor/solicitacoes")
    })
})

router.post("/finalizar", eAdmin, (req, res) => {
    Solicitacao.findOne({_id: req.body.id_solicitacao}).then((solicitacao) => {
      solicitacao.status = "Finalizada",
      solicitacao.atualizacao = Date.now()

      solicitacao.save().then(() => {
        req.flash("success_msg", "Solicitação em finalizada com sucesso")
        res.redirect("/servidor/solicitacoes/andamentos")
      }).catch((err) => {
        req.flash("error_msg", "Erro ao tentar salvar a edição da solicitacao: " + err)
        res.redirect("/servidor/solicitacoes")
      })
    }).catch((err) => {
      req.flash("error_msg", "Erro ao tentar encontrar solicitacao: " + err)
      res.redirect("/servidor/solicitacoes")
    })
})

module.exports = router
