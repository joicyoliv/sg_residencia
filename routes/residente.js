const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const {eComum} = require("../helpers/eComum")

/* CARREGANDO MODELS */
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
require("../models/Residente")
const Residente = mongoose.model("residentes")
require("../models/Solicitacao")
const Solicitacao= mongoose.model("solicitacoes")

/* ROTAS */

/* Home */
router.get("/", eComum, (req, res) => {
  res.render("residente/home")
})

router.post("/acompanhar_solicitacoes", eComum, (req, res) => {
  Solicitacao.find({solicitanteUsuario: req.body.id_usuario}).populate("solicitanteUsuario").populate("solicitanteResidencia").populate("solicitanteQuarto").then((solicitacoes) => {
      res.render("residente/solicitacoes", {solicitacoes: solicitacoes})
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar Solicitações: " + err)
    res.redirect("/servidor/solicitacoes")
  })
})


router.get("/solicitar", eComum, (req, res) => {
  res.render("residente/addsolicitacao")
})

router.post("/solicitar", eComum, (req, res) => {
  Residente.findOne({usuario: req.body.id_usuario}).then((residente) => {
    //cadastra solicitacao
    const novaSolicitacao = {
      tipoServico: req.body.tipoServico,
      descricao: req.body.descricao,
      solicitante: residente._id,
      solicitanteUsuario: req.body.id_usuario,
      solicitanteResidencia: residente.residencia,
      solicitanteQuarto: residente.quarto
    }

    new Solicitacao(novaSolicitacao).save().then(() => {
      req.flash("success_msg", "Serviço solicitado com sucesso ")
      res.redirect("/residente")
    }).catch((err) => {
      req.flash("error_msg", "Erro ao tentar fazer solicitacao: " + err)
      res.redirect("/residente")
    })
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar encontrar residente logado: " + err)
    res.redirect("/residente")
  })
})

module.exports = router
