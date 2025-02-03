const db = require("../../models"); // Ajuste o caminho conforme necessário
const Torneio = db.Torneio; // Ajuste o caminho conforme necessário
const Usuario = db.Usuario; // Ajuste o caminho conforme necessário
const user_toneio = db.UsuarioTorneio; // Ajuste o caminho conforme necessário
const vs = db.Adversarios;
const axios = require("axios");
const aux = require("./aux.controller");


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

async function is_finish(torneioId) {
  const maxPoint = await user_toneio.findAll({
    where: {
      torneioId,
    },
    order: [["pontos", "DESC"]],
    limit: 1,
  });
  const winners = await user_toneio.findAll({
    where: {
      torneioId,
      pontos: maxPoint[0].pontos,
    },
  });
  if (winners.length === 1) {
    await Torneio.update(
      { status: "closed" },
      {
        where: {
          id: torneioId,
        },
      }
    );
  } else {
    await user_toneio.update(
      { status: "off" },
      {
        where: {
          torneioId,
          pontos: {
            [db.Sequelize.Op.lt]: maxPoint[0].pontos,
          },
        },
      }
    );

    await user_toneio.update(
      { status: "on" },
      {
        where: {
          torneioId,
          pontos: maxPoint[0].pontos,
        },
      }
    );
  }
}

exports.select_winner = async (req, res) => {
  try {
    const { torneioId, usuarioId, vsId } = req.params;
    // eliminatoria ou allvsall
    const torneios = await Torneio.findByPk(torneioId);
    if (!torneios || !usuarioId || !vsId) {
      return res.status(400).json({
        status: false,
        msg: "Dados inválidos",
      });
    }
    let type = torneios.type;
    const user = await Usuario.findByPk(usuarioId);
    if (!user) {
      return res.status(404).json({
        status: false,
        msg: "Jogador não encontrado",
      });
    }

    const jogador = await user_toneio.findOne({
      where: {
        usuarioId: user.id,
        torneioId,
      },
    });
    if (!jogador) {
      return res.status(404).json({
        status: false,
        msg: "Jogador não inscrito no torneio",
      });
    }
    let pontos = 0;
    pontos = user.pontos + 1;
    await Usuario.update(
      { pontos },
      {
        where: { id: user.id },
      }
    );

    let pontosJogador = 0;
    pontosJogador = jogador.pontos + 1;
    await user_toneio.update(
      { pontos: pontosJogador },
      {
        where: { id: jogador.id },
      }
    );
    await vs.update(
      { winner: user.username },
      {
        where: { id: vsId },
      }
    );

    if (type === "eliminatoria") {
      const partida = await vs.findByPk(vsId);
      if (partida.jogador1Id != user.id) {
        await user_toneio.update(
          {
            status: "off",
          },
          {
            where: {
              torneioId,
              usuarioId: partida.jogador1Id,
            },
          }
        );
      } else {
        await user_toneio.update(
          {
            status: "off",
          },
          {
            where: {
              torneioId,
              usuarioId: partida.jogador2Id,
            },
          }
        );
      }
    }

    // find o confronto
    const vencedor = await vs.findAll({
      where: { torneioId: torneioId },
      order: [["id", "ASC"]],
    });
    //pegar o usuername dos jogadores
    const PartidasUser = await Promise.all(
      vencedor.map(async (partida) => {
        const jogador1 = await Usuario.findByPk(partida.jogador1Id);
        const jogador2 = await Usuario.findByPk(partida.jogador2Id);
        return {
          vsId: partida.id,
          winner: partida.winner || "0",
          rodada: partida.rodada,
          jogador1: {
            usuarioId: jogador1.id,
            username: jogador1.username,
            countryImg: await getCountry(jogador1.country),
          },
          jogador2: {
            usuarioId: jogador2.id,
            username: jogador2.username,
            countryImg: await getCountry(jogador2.country),
          },
        };
      })
    );

    if (PartidasUser.length >= 1 && type === "allvsall") {
      if (
        !(PartidasUser.filter((partida) => partida.winner === "0").length > 0)
      ) {
        is_finish(torneioId);
      }
    }
    const verifyElim = await user_toneio.findAll({
      where: {
        torneioId,
        status: "on",
      },
    });
    if (PartidasUser.length >= 1 && type === "eliminatoria") {
      if (verifyElim.length === 1 || verifyElim.length === 0) {
        is_finish(torneioId);
      }
    }

    // Verificar o top de usuários dentro de um torneio
    const top = await user_toneio.findAll({
      where: {
        torneioId,
      },
      order: [["pontos", "DESC"]],
      limit: 3,
    });

    const topUsers = await Promise.all(
      top.map(async (user) => {
        const usuario = await Usuario.findByPk(user.usuarioId);
        return {
          username: usuario.username,
          countryImg: await getCountry(user.country),
          pontos: user.pontos,
        };
      })
    );

    // Verificar o top de usuários dentro de um torneio
    const ranking_torneio = await user_toneio.findAll({
      where: {
        torneioId,
      },
      order: [["pontos", "DESC"]],
    });
    const ranking_data = await Promise.all(
      ranking_torneio.map(async (user) => {
        const usuario = await Usuario.findByPk(user.usuarioId);
        bandeira = await getCountry(usuario.country);
        if (!usuario) return null;
        return {
          usuario: {
            usuarioId: usuario.id,
            username: usuario.username,
            countryImg: bandeira,
            pontos: user.pontos,
          },
        };
      })
    );

    const new_rank = ranking_data.filter((user) => user.usuario.pontos > 0);
    const subcribe = await user_toneio.findAll({
      where: {
        torneioId,
      },
    });
    const now_torneio = await Torneio.findByPk(torneioId);

    // ranking individual do usuário
    const filteredRanking = await aux.ft_ranking(user.id, res, req);
    if (type === "allvsall") {
      type = "Todos vs Todos";
    } else type = "Eliminatória";
    const data = {
      status: true,
      msg: "Todas partidas do torneio",
      torneio: {
        inscritos: subcribe.length,
        usuarioId: now_torneio.usuarioId,
        torneioId: now_torneio.id,
        name: now_torneio.name,
        date_start: now_torneio.date_start,
        type: type,
        status: now_torneio.status,
      },
      PartidasUser: agruparPorRodada(PartidasUser),
    };

    const io = req.app.get("socketio");
    io.emit("partidas_geradas", data);
    io.emit("top_users", topUsers);
    io.emit("ranking_individual", filteredRanking);
    io.emit("rank_torneio", new_rank);
    return res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: [
        {
          msg: "Erro ao selecionar o vencedor",
          error: error.message,
        },
      ],
    });
  }
};
