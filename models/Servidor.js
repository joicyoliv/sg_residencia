const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Servidor = new Schema({
  cargo: {
    type: String,
    required: true
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "usuarios",
    required: true
  }
})

mongoose.model("servidores", Servidor)
