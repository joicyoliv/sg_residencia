const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Residencia = new Schema({
  nome: {
    type: String,
    required: true
  },
  endereco: {
    type: String,
    required: true
  },
  quartos: {
    type:[Schema.Types.ObjectId],
    ref: "quartos"
  },
  criacao: {
    type: Date,
    default: Date.now()
  },
  atualizacao: {
    type: Date,
    default: Date.now()
  }
})

mongoose.model("residencias", Residencia)
