const db = require("../../models"); // Ajuste o caminho conforme necessário
const user_toneio = db.UsuarioTorneio; // Ajuste o caminho conforme necessário

const agruparPorRodada = (partidas) => {
  const agrupadas = partidas.reduce((resultado, partida) => {
    if (!resultado[partida.rodada]) {
      resultado[partida.rodada] = [];
    }
    resultado[partida.rodada].push(partida);
    return resultado;
  }, {});

  return Object.values(agrupadas); // Retorna apenas o array de rodadas
};

async function general_data(partida, PartidasUser, type, torneioId) {
  const subcribe = await user_toneio.findAll({
    where: {
      torneioId,
    },
  });
  if (type === "allvsall") {
    type = "Todos vs Todos";
  } else if (type === "eliminatoria") {
    type = "Eliminatória";
  } else type = "Team";
  const data = {
    status: true,
    msg: "Todas partidas do torneio",
    torneio: {
      inscritos: subcribe.length,
      usuarioId: partida.usuarioId,
      torneioId: partida.id,
      name: partida.name,
      date_start: partida.date_start,
      type: type,
      status: partida.status,
    },
    PartidasUser: agruparPorRodada(PartidasUser),
  };
  return data;
}

module.exports = general_data;
