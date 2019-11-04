const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Residente = new Schema({
  renda: {
    type: Number,
    required: true
  },
  curso: {
    type: String,
    required: true
  },
  integralizacao: {
    type: Number,
    required: true,
    default: Math.floor(Math.random() * 100) /* temporario */
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "usuarios",
    required: true
  },
  quarto: {
    type: Schema.Types.ObjectId,
    ref: "quartos"
  },
  residencia: {
    type: Schema.Types.ObjectId,
    ref: "residencias"
  }
})

mongoose.model("residentes", Residente)
