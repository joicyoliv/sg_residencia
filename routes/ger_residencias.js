const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const {eAdmin} = require("../helpers/eAdmin")
/* CARREGANDO MODELS */
require("../models/Residencia")
const Residencia = mongoose.model("residencias")
require("../models/Quarto")
const Quarto = mongoose.model("quartos")

/* ROTAS */

/* Gerencia de residencias */
router.get("/", eAdmin, (req, res) => {
  Residencia.find().populate({path: "quartos", model: Quarto}).sort({criacao: "desc"}).then((residencias) => {
    res.render("servidor/residencias", {residencias: residencias})
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar listar as residencias: " + err)
    res.redirect("/servidor")
  })
})

/* abre formulario de cadastro */
router.get("/adicionar", eAdmin, (req, res) => {
  res.render("servidor/addresidencia")
})

/* cadastra a residencia no banco */
router.post("/adicionar", eAdmin, (req, res) => {
  var erros = []

  if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({texto: "Nome invalido"})
  }

  if(!req.body.endereco || typeof req.body.endereco == undefined || req.body.endereco == null) {
    erros.push({texto: "Endereço invalido"})
  }

  if(erros.length > 0) {
    res.render("servidor/addresidencia", {erros: erros})
  } else {
    const novaResidencia = {
      nome: req.body.nome,
      endereco: req.body.endereco
    }

    new Residencia(novaResidencia).save().then(() => {
      req.flash("success_msg", "Residência adicionada com sucesso")
      res.redirect("/servidor/residencias")
    }).catch((err) => {
      req.flash("error_msg", "Erro ao tentar adicionar residencia: " + err)
      res.redirect("/servidor/residencias")
    })
  }
})

/* abre formulario de edicao */
router.get("/editar/:id", (req, res) => {
    Residencia.findOne({_id: req.params.id}).then((residencia) => {
    res.render("servidor/editresidencia", {residencia: residencia})
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar encontrar residencia: " + err)
    res.redirect("/servidor/residencias")
  })
})

/* edita a residencia no banco */
router.post("/editar", (req, res) => {
  var erros = []

  if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({texto: "Nome invalido"})
  }

  if(!req.body.endereco || typeof req.body.endereco == undefined || req.body.endereco == null) {
    erros.push({texto: "Endereço invalido"})
  }

  if(erros.length > 0) {
    res.render("servidor/addresidencia", {erros: erros})
  } else {
    Residencia.findOne({_id: req.body.id}).then((residencia) => {
      residencia.nome = req.body.nome,
      residencia.endereco = req.body.endereco,
      residencia.atualizacao = Date.now()

      residencia.save().then(() => {
        req.flash("success_msg", "Residência editada com sucesso")
        res.redirect("/servidor/residencias")
      }).catch((err) => {
        req.flash("error_msg", "Erro ao tentar salvar a edição da residência: " + err)
        res.redirect("/servidor/residencias")
      })
    }).catch((err) => {
      req.flash("error_msg", "Erro ao tentar editar residencia: " + err)
      res.redirect("/servidor/residencias")
    })
  }
})

router.get("/deletar/:id", eAdmin, (req, res) => {
    Residencia.deleteOne({_id: req.params.id}).then((residencia) => {
    req.flash("success_msg", "Residência deletada com sucesso")
    res.redirect("/servidor/residencias")
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar encontrar residencia: " + err)
    res.redirect("/servidor/residencias")
  })
})

router.get("/adicionar_quarto/:id", eAdmin, (req, res) => {
    Residencia.findOne({_id: req.params.id}).then((residencia) => {
    res.render("servidor/addquarto", {residencia: residencia})
  }).catch((err) => {
    req.flash("error_msg", "Erro ao tentar encontrar residencia para adição de quarto: " + err)
    res.redirect("/servidor/residencias")
  })
})

/* cadastra a residencia no banco */
router.post("/adicionar_quarto", eAdmin, (req, res) => {
  var erros = []

  if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
    erros.push({texto: "Titulo invalido"})
  }

  if(!req.body.capacidade || typeof req.body.capacidade == undefined || req.body.capacidade == null) {
    erros.push({texto: "Capacidade invalida"})
  }

  if(erros.length > 0) {
    res.render("servidor/addquarto", {erros: erros})
  } else {
    const novoQuarto = {
      titulo: req.body.titulo,
      capacidade: req.body.capacidade,
      sexo: req.body.sexo,
      residencia: req.body.id_residencia
    }

    new Quarto(novoQuarto).save().then((lastQuarto) => {
      /***** adicionando quarto a residencia *****/
      Residencia.findOne({_id: lastQuarto.residencia}).then((residencia) => {
        residencia.quartos.push(lastQuarto)
        residencia.save().catch((err) => {
          req.flash("error_msg", "Erro ao tentar salvar quarto na da residência: " + err)
          res.redirect("/servidor/residencias")
        })
      })
      /***************************/

      req.flash("success_msg", "Quarto adicionado com sucesso")
      res.redirect("/servidor/residencias")
    }).catch((err) => {
      req.flash("error_msg", "Erro ao tentar adicionar quarto: " + err)
      res.redirect("/servidor/residencias")
    })
  }
})

/* Fim de gerencia de residencias */

module.exports = router
