const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Avaliacao = new Schema({
  comentario: {
    type: String,
    required: true
  },
  estrelas: {
    type: Number,
    required: true
  },
  residente: {
    type: Schema.Types.ObjectId,
    ref: "residentes",
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

mongoose.model("avaliacoes", Avaliacao)
