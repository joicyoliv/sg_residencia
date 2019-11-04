const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Solicitacao = new Schema({
  tipoServico: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: "Pendente"
  },
  funcionario: {
    type: String,
    required: true,
    default: "Sem funcionário delegado ainda"
  },
  solicitante: {
    type: Schema.Types.ObjectId,
    ref: "residentes",
    required: true
  },
  solicitanteResidencia: {
    type: Schema.Types.ObjectId,
    ref: "residencias",
    required: true
  },
  solicitanteQuarto: {
    type: Schema.Types.ObjectId,
    ref: "quartos",
    required: true
  },
  solicitanteUsuario: {
    type: Schema.Types.ObjectId,
    ref: "usuarios",
    required: true
  },
  avaliacoes: {
    type:[Schema.Types.ObjectId],
    ref: "avaliacoes"
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

mongoose.model("solicitacoes", Solicitacao)
