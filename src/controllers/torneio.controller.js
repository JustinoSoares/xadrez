// src/controllers/torneioController.js

const db = require("../../models"); // Ajuste o caminho conforme necessário
const Torneio = db.Torneio; // Ajuste o caminho conforme necessário
const Usuario = db.Usuario; // Ajuste o caminho conforme necessário
const user_toneio = db.UsuarioTorneio; // Ajuste o caminho conforme necessário
const vs = db.Adversarios;
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
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

exports.createTorneio = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        errors: errors.array(),
      });
    }
    const { name, pass, date_start } = req.body;
    const usuarioId = req.userId;

    const torneio = await Torneio.create({
      name,
      date_start: date_start,
      pass: bcrypt.hashSync(pass, 10),
      usuarioId,
    });

    await Torneio.update(
      { date_start },
      {
        where: {
          id: torneio.id,
        },
      }
    );
    res.status(201).json({
      status: true,
      msg: "Torneio criado com sucesso",
      data: torneio,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: "Erro ao criar torneio",
      error: error.message,
    });
  }
};

exports.getTorneios = async (req, res) => {
  try {
    const status = req.query.status || "open";
    const search = req.query.search || "";
    const torneios = await Torneio.findAll({
      where: {
        status,
        name: {
          [db.Sequelize.Op.iLike]: `%${search}%`,
        },
      },
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["username", "country"],
        },
      ],
    });

    const userSubscribed = await Promise.all(
      torneios.map(async (torneio) => {
        const subscribed = await user_toneio.findAll({
          where: {
            torneioId: torneio.id,
          },
        });
        return {
          inscritos: subscribed.length,
          torneio: torneio,
        };
      })
    );
    res.status(200).json({
      status: true,
      msg: "Todos torneios",
      data: userSubscribed,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.subcribeTorneio = async (req, res) => {
  try {
    const { torneioId } = req.params;
    const pass = req.body.pass;
    const usuarioId = req.userId;

    if (!torneioId) {
      return res.status(400).json({
        status: false,
        msg: "Dados inválidos",
      });
    }
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({
        status: false,
        msg: "Usuário não encontrado",
      });
    }
    const torneio = await Torneio.findByPk(torneioId);
    if (!torneio) {
      return res.status(404).json({
        status: false,
        msg: "Torneio não encontrado",
      });
    }
    const AllSubscribed = await user_toneio.findAll({
      where: {
        usuarioId,
        torneioId,
      },
    });
    if (AllSubscribed.length > 0) {
      await user_toneio.destroy({
        where: {
          usuarioId,
          torneioId,
        },
      });
      return res.status(200).json({
        status: true,
        msg: "Usuário saio do torneio",
      });
    }
    if (usuarioId === torneio.usuarioId) {
      return res.status(400).json({
        status: false,
        msg: "Usuário não pode se inscrever no próprio torneio",
      });
    }
    if (!pass) {
      return res.status(400).json({
        status: false,
        msg: "Senha do torneio é obrigatória",
      });
    }
    const match = await bcrypt.compare(pass, torneio.pass);
    if (!match) {
      return res.status(400).json({
        status: false,
        msg: "Senha do torneio incorreta",
      });
    }
    const subcribe = await user_toneio.create({
      usuarioId,
      torneioId,
      status: "on",
    });
    if (!subcribe) {
      return res.status(400).json({
        status: false,
        msg: "Erro ao inscrever usuário no torneio",
      });
    }
    res.status(200).json({
      status: true,
      msg: "Inscrição realizada com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Erro ao inscrever usuário no torneio",
    });
  }
};

exports.AllvsAll = async (req, res) => {
  try {
    const torneioId = req.params.torneioId;
    const usuarioId = req.userId;
    const torneio = await Torneio.findByPk(torneioId);

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

    if (jogadoresInscritos.length % 2 !== 0) {
      return res.status(400).json({
        status: false,
        msg: "Número de jogadores inscritos deve ser par",
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
    return res.status(200).json({
      status: true,
      msg: "Partidas geradas com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      error: [
        {
          msg: "Erro ao gerar partidas",
          param: "torneioId",
          location: "params",
        },
      ],
    });
  }
};

exports.eliminatoria = async (req, res) => {
  try {
    const torneioId = req.params.torneioId;
    const usuarioId = req.userId;
    const torneio = await Torneio.findByPk(torneioId);

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
    for (let i = 0; i < jogadoresInscritos.length; i++) {
      if (i % 2 === 0) {
        const partidas = vs.create({
          jogador1Id: jogadoresInscritos[i].usuarioId,
          jogador2Id: jogadoresInscritos[i + 1].usuarioId,
          torneioId: torneioId,
        });
      }
    }
    const this_partidas = await vs.findAll({
      where: { torneioId: torneioId },
    });

    res.status(200).json({
      status: true,
      msg: "Partidas geradas com sucesso",
      data: this_partidas,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

exports.close_torneio = async (req, res) => {
  try {
    const torneioId = req.params.torneioId;
    const usuarioId = req.userId;
    const torneio = await Torneio.findByPk(torneioId);
    if (usuarioId !== torneio.usuarioId) {
      return res.status(403).json({
        status: false,
        msg: "Usuário não autorizado",
      });
    }
    if (!torneio) {
      return res.status(404).json({
        status: false,
        msg: "Torneio não encontrado",
      });
    }
    await Torneio.update(
      { status: "closed" },
      {
        where: {
          id: torneioId,
        },
      }
    );
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

exports.partida = async (req, res) => {
  try {
    const torneioId = req.params.torneioId;
    const partidas = await vs.findAll({
      where: { torneioId: torneioId },
    });
    //pegar o usuername dos jogadores
    const PartidasUser = await Promise.all(
      partidas.map(async (partida) => {
        const jogador1 = await Usuario.findByPk(partida.jogador1Id);
        const jogador2 = await Usuario.findByPk(partida.jogador2Id);
        return {
          jogador1: jogador1.username,
          jogador2: jogador2.username,
        };
      })
    );
    res.status(200).json({
      status: true,
      msg: "Todas partidas do torneio",
      PartidasUser,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

exports.subscribed = async (req, res) => {
  try {
    const torneioId = req.params.torneioId;
    const torneio = await Torneio.findByPk(torneioId);
    if (!torneio) {
      return res.status(404).json({
        status: false,
        msg: "Torneio não encontrado",
      });
    }
    const subscribed = await user_toneio.findAll({
      where: {
        torneioId,
      },
    });

    const userSubscribed = await Promise.all(
      subscribed.map(async (sub) => {
        const user = await Usuario.findByPk(sub.usuarioId);
        const bandeira = await getCountry(user.country);
        return {
          username: user.username,
          countryImg: bandeira,
        };
      })
    );
    if (subscribed.length < 1) {
      return res.status(404).json({
        status: false,
        msg: "Nem um torneio encontrado",
      });
    }
    res.status(200).json({
      status: true,
      msg: "Todos usuairos inscritos no torneio",
      quantidade: subscribed.length,
      data: userSubscribed,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Erro ao verificar inscrição do usuário",
    });
  }
};

exports.select_winner = async (req, res) => {
  try {
    const { torneioId, username, vsId } = req.params;
    // eliminatoria ou allvsall
    const type = req.query.type || "allvsall";

    if (!torneioId || !username || !vsId) {
      return res.status(400).json({
        status: false,
        msg: "Dados inválidos",
      });
    }
    const user = await Usuario.findOne({
      where: { username },
    });
    if (!user) {
      return res.status(404).json({
        status: false,
        msg: "Jogador não encontrado",
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
    let pontosJogador = 0;
    pontosJogador = jogador.pontos + 1;
    await user_toneio.update(
      { pontos: pontosJogador },
      {
        where: { id: jogador.id },
      }
    );
    await vs.update(
      { winner: username },
      {
        where: { id: vsId },
      }
    );
    if (type === "eliminatoria") {
      const partida = await vs.findByPk(vsId);

      if (partida.jogador1Id != user.id) {
        const new_torneio = await Torneio.findByPk(torneioId);
        await UsuarioTorneio.update(
          {
            status: "off",
          },
          {
            where: {
              torneioId,
              jogador1Id: partida.jogador1Id,
            },
          }
        );
      } else if (partida.jogador2Id != user.id) {
        const new_torneio = await Torneio.findByPk(torneioId);
        await UsuarioTorneio.update(
          {
            status: "off",
          },
          {
            where: {
              torneioId,
              jogador2Id: partida.jogador2Id,
            },
          }
        );
      }
    }
    return res.status(200).json({
      status: true,
      msg: "Vencedor atualizado com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

exports.topTorneio = async (req, res) => {
  try {
    const torneioId = req.params.torneioId;
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
          pontos: user.pontos,
        };
      })
    );
    res.status(200).json({
      status: true,
      msg: "Top 3 jogadores do torneio",
      data: topUsers,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Erro ao buscar top 3 jogadores",
    });
  }
};
