const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Quarto = new Schema({
  titulo: {
    type: String,
    required: true
  },
  capacidade: {
    type: Number,
    required: true
  },
  membros: {
    type: Number,
    default: 0
  },
  sexo: {
    type: String,
    required: true
  },
  residencia: {
    type: Schema.Types.ObjectId,
    ref: "residencias",
    required: true
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

mongoose.model("quartos", Quarto)
