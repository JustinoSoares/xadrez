const db = require("../../models"); // Ajuste o caminho conforme necessário
const Torneio = db.Torneio; // Ajuste o caminho conforme necessário
const Usuario = db.Usuario; // Ajuste o caminho conforme necessário
const user_toneio = db.UsuarioTorneio; // Ajuste o caminho conforme necessário
const vs = db.Adversarios;
const axios = require("axios");

async function getCountry(country) {
  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${country}`
    );
    return response.data[0].flag;
  } catch (error) {
    return 0;
  }
}

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

exports.eliminatoria = async (req, res) => {
  try {
    const torneioId = req.params.torneioId;
    const usuarioId = req.userId;
    const torneio = await Torneio.findByPk(torneioId);

    if (!torneio || torneio.status === "closed") {
      return res.status(404).json({
        status: false,
        msg: "Torneio não encontrado ou já encerrado",
      });
    }

    if (torneio.type != "eliminatoria") {
      return res.status(400).json({
        status: false,
        msg: "Tipo de torneio inválido, tente outro tipo",
      });
    }

    if (usuarioId !== torneio.usuarioId) {
      return res.status(403).json({
        status: false,
        errors: [
          {
            msg: "Usuário não autorizado",
          },
        ],
      });
    }
    const jogadoresInscritos = await user_toneio.findAll({
      where: {
        torneioId: torneioId,
        status: "on",
      },
    });

    if (jogadoresInscritos.length < 1) {
      return res.status(400).json({
        status: false,
        msg: "O número de jogadores inscritos é insuficiente",
      });
    }
    const last_partidas = await vs.findAll({
      where: { torneioId: torneioId },
      order: [["rodada", "DESC"]],
      limit: 1,
    });
    let rodada = 1;
    if (last_partidas.length) {
      rodada = last_partidas[0].rodada + 1;
    }
    // fechar o torneio depois de gerar as partidas
    await Torneio.update({ status: "current" }, { where: { id: torneioId } });
    let len = jogadoresInscritos.length;
    for (let i = 0; i < len; i++) {
      if (i % 2 === 0 && i + 1 < len) {
        const existe = await vs.findAll({
          where: {
            jogador1Id: jogadoresInscritos[i].usuarioId,
            jogador2Id: jogadoresInscritos[i + 1].usuarioId,
            torneioId: torneioId,
            winner : { [db.Sequelize.Op.ne]: null},
          },
        });
        if (existe.length > 0) continue;
        await vs.create({
          jogador1Id: jogadoresInscritos[i].usuarioId,
          jogador2Id: jogadoresInscritos[i + 1].usuarioId,
          torneioId: torneioId,
          rodada: rodada,
        });
      }
    }

    const this_partidas = await vs.findAll({
      where: { torneioId: torneioId },
      order: [["id", "ASC"]],
    });

    //pegar o usuername dos jogadores
    const PartidasUser = await Promise.all(
      this_partidas.map(async (partida) => {
        const jogador1 = await Usuario.findByPk(partida.jogador1Id);
        const jogador2 = await Usuario.findByPk(partida.jogador2Id);
        const bandeira1 = await getCountry(jogador1.country);
        const bandeira2 = await getCountry(jogador2.country);
        return {
          vsId: partida.id,
          winner: partida.winner || "0",
          rodada: partida.rodada,
          jogador1: {
            usuarioId: jogador1.id,
            username: jogador1.username,
            countryImg: bandeira1,
          },
          jogador2: {
            usuarioId: jogador2.id,
            username: jogador2.username,
            countryImg: bandeira2,
          },
        };
      })
    );
    const subcribe = await user_toneio.findAll({
      where: {
        torneioId,
      },
    });

    const now_torneio = await Torneio.findByPk(torneioId);
    const data = {
      status: true,
      msg: "Todas partidas do torneio",
      torneio: {
        inscritos: subcribe.length,
        usuarioId: now_torneio.usuarioId,
        torneioId: now_torneio.id,
        name: now_torneio.name,
        date_start: now_torneio.date_start,
        type: "Eliminatória",
        status: now_torneio.status,
      },
      PartidasUser: agruparPorRodada(PartidasUser),
    };
    const io = req.app.get("socketio");
    io.emit("partidas_geradas", data);
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};
