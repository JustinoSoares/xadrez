const db = require("../../models"); // Ajuste o caminho conforme necessário
const Torneio = db.Torneio; // Ajuste o caminho conforme necessário
const Team = db.Team; // Ajuste o caminho conforme necessário
const Usuario = db.Usuario; // Ajuste o caminho conforme necessário
const user_toneio = db.UsuarioTorneio; // Ajuste o caminho conforme necessário
const vs = db.Adversarios;
const axios = require("axios");
const aux = require("./aux.controller");

exports.teams = async (req, res) => {
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
        type: "team",
        status: "on",
        teamId: {
          [db.Sequelize.Op.ne]: null,
        },
        order: [["teamId", "DESC"]],
      },
      order: [["", "ASC"]],
    });
    if (jogadoresInscritos.length < 1) {
      return res.status(404).json({
        status: false,
        msg: "Nenhum jogador inscrito",
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
    await Torneio.update({ status: "current" }, { where: { id: torneioId } });
    let len = jogadoresInscritos.length;
    // formar jogos entre os teams evitando repetições e jogos  entre jogadores do mesmo team
    const formTeams = await Promise.all(
      jogadoresInscritos.map(async (jogador, index) => {
        for (i = index + 1; i < len; i++) {
          if ((i !== index) && i + 1 < len
          && jogadoresInscritos[i].teamId !== jogador.teamId
        ) {
            const existe = await vs.findAll({
              where: {
                torneioId: torneioId,
                rodada,
                [db.Sequelize.Op.or]: [
                  {
                    jogador1: jogador.usuarioId,
                    jogador2: jogadoresInscritos[i].usuarioId,
                  },
                  {
                    jogador1: jogadoresInscritos[i].usuarioId,
                    jogador2: jogador.usuarioId,
                  },
                ],
              },
            });
            if (existe.length > 0) continue;
            if (existe.length === 0) {
              return {
                rodada,
                jogador1: jogador.usuarioId,
                jogador2: jogadoresInscritos[i].usuarioId,
                torneioId,
              };
            }
          }
        }
      })
    );
    const teams = await Team.findAll({
      where: { torneioId },
    });

    return res.status(200).json({
      status: true,
      teams,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      msg: "Erro ao buscar times",
      error: error.message,
    });
  }
};
