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

async function PartidasGeradas(torneioId) {
  const partidas = await vs.findAll({
    where: { torneioId: torneioId },
    order: [["id", "ASC"]],
  });
  //pegar o usuername dos jogadores
  const PartidasUser = await Promise.all(
    partidas.map(async (partida) => {
      const jogador1 = await Usuario.findByPk(partida.jogador1Id);
      const jogador2 = await Usuario.findByPk(partida.jogador2Id);
      const bandeira1 = await getCountry(jogador1.country);
      const bandeira2 = await getCountry(jogador2.country);
      return {
        vsId: partida.id,
        winner: partida.winner || "0",
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
  data = {
    status: true,
    msg: "Todas partidas do torneio",
    torneio: {
      inscritos: subcribe.length,
      usuarioId: now_torneio.usuarioId,
      torneioId: now_torneio.id,
      name: now_torneio.name,
      date_start: now_torneio.date_start,
      type: "Todos vs Todos",
      status: now_torneio.status,
    },
    PartidasUser: PartidasUser.sort((a, b) => a.vsId - b.vsId),
  };
  return data;
}

exports.AllvsAll = async (req, res) => {
  try {
    const torneioId = req.params.torneioId;
    const usuarioId = req.userId;
    const torneio = await Torneio.findByPk(torneioId);

    const primary_torneio = await Torneio.findAll({
      where: { id: torneioId, status: "open" },
      limit: 1,
    });
    if (!primary_torneio) {
      return res.status(400).json({
        status: false,
        msg: "Torneio não encontrado ou já encerrado",
      });
    }

    if (torneio.type !== "allvsall") {
      return res.status(400).json({
        status: false,
        msg: "Tipo de torneio inválido, tente outro tipo",
      });
    }
    if (usuarioId !== torneio.usuarioId) {
      return res.status(403).json({
        status: false,
        msg: "Usuário não autorizado",
      });
    }
    if (!torneio || torneio.status != "open") {
      return res.status(404).json({
        status: false,
        msg: "Torneio encerrado ou não encontrado",
      });
    }
    const jogadoresInscritos = await user_toneio.findAll({
      where: {
        torneioId: torneioId,
        status: "on",
      },
    });

    if (jogadoresInscritos.length < 1) {
      return res.status(404).json({
        status: false,
        msg: "O número de jogadores inscritos é insuficiente",
      });
    }
    let partidasGeradas = [];
    let confrontosRealizados = new Set();

    for (let i = 0; i < jogadoresInscritos.length; i++) {
      for (let j = i + 1; j < jogadoresInscritos.length; j++) {
        const confrontoKey = `${jogadoresInscritos[i].usuarioId} x ${jogadoresInscritos[j].usuarioId}`;
        const game = await vs.findOne({
          where: {
            jogador1Id: jogadoresInscritos[i].usuarioId,
            jogador2Id: jogadoresInscritos[j].usuarioId,
            torneioId: torneioId,
          },
        });
        if (game) {
          continue;
        }
        if (!confrontosRealizados.has(confrontoKey)) {
          const partidas = vs.create({
            jogador1Id: jogadoresInscritos[i].usuarioId,
            jogador2Id: jogadoresInscritos[j].usuarioId,
            torneioId: torneioId,
          });
          partidasGeradas.push(partidas);
          confrontosRealizados.add(confrontoKey);
        }
      }
    }
    // fechar o torneio depois de gerar as partidas
    await Torneio.update({ status: "current" }, { where: { id: torneioId } });
    // retornar as partidas geradas
    const data = await PartidasGeradas(torneioId);

    const io = req.app.get("socketio");
    io.emit("partidas_geradas", data);
    return res.status(200).json({
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      error: [
        {
          msg: "Erro ao gerar partidas",
          error: error.message,
        },
      ],
    });
  }
};