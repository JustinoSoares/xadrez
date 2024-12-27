// src/controllers/torneioController.js

const db = require("../../models"); // Ajuste o caminho conforme necessário
const Torneio = db.Torneio; // Ajuste o caminho conforme necessário
const Usuario = db.Usuario; // Ajuste o caminho conforme necessário
const user_toneio = db.UsuarioTorneio; // Ajuste o caminho conforme necessário
const vs = db.Adversarios;
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const axios = require("axios");
const aux = require("./aux.controller");
const { where } = require("sequelize");

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
    const { name, pass, date_start, type } = req.body;
    const usuarioId = req.userId;

    const io = req.app.get("socketio");

    const torneio = await Torneio.create({
      name,
      date_start: date_start,
      type,
      pass: bcrypt.hashSync(pass, 10),
      usuarioId,
    });

    const user = await Usuario.findByPk(usuarioId);
    const subscribed = await user_toneio.findAll({
      where: {
        torneioId: torneio.id,
      },
    });
    const data = {
      torneio: {
        inscritos: subscribed.length,
        id: torneio.id,
        name: torneio.name,
        date_start: torneio.date_start,
        type: torneio.type,
        status: torneio.status,
        is_subscribed: false,
        usuario: {
          usuarioId: torneio.usuarioId,
          username: user.username,
          countryImg: await getCountry(user.country),
        },
      },
    };

    io.emit("novo_torneio", data);
    res.status(201).json({
      status: true,
      msg: "Torneio criado com sucesso",
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: "Erro ao criar torneio",
      error: error.message,
    });
  }
};

exports.getTorneioById = async (req, res) => {
  try {
    const torneioId = req.params.torneioId;
    const torneio = await Torneio.findByPk(torneioId);
    if (!torneio) {
      return res.status(404).json({
        status: false,
        msg: "Torneio não encontrado",
      });
    }
    const user = await Usuario.findByPk(torneio.usuarioId);
    const bandeira = await getCountry(user.country);
    const data = {
      id: torneio.id,
      name: torneio.name,
      date_start: torneio.date_start,
      type: torneio.type,
      status: torneio.status,
      usuario: {
        usuarioId: user.id,
        username: user.username,
        countryImg: bandeira,
      },
    };
    res.status(200).json({
      status: true,
      msg: "Torneio encontrado",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Erro ao buscar torneio",
    });
  }
};

exports.getTorneios = async (req, res) => {
  try {
    const status = req.query.status || "open";
    const search = req.query.search || "";
    const userId = req.userId;
    const maxLen = req.query.maxLen || 10;
    const offset = req.query.offset || 0;
    const order = req.query.order || "DESC";
    const attribute = req.query.attribute || "createdAt";
    const torneios = await Torneio.findAll({
      where: {
        status,
        name: {
          [db.Sequelize.Op.iLike]: `%${search}%`,
        },
      },
      limit: maxLen,
      offset: offset,
      order: [[attribute, order]],
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "username", "country"],
        },
      ],
    });

    const userSubscribed = await Promise.all(
      torneios.map(async (torneio) => {
        const bandeira = await getCountry(torneio.usuario.country);
        const active = await user_toneio.findOne({
          where: {
            usuarioId: userId,
            torneioId: torneio.id,
          },
        });
        const subscribed = await user_toneio.findAll({
          where: {
            torneioId: torneio.id,
          },
        });
        torneio.usuario.country = bandeira;
        let type = torneio.type;
        if (type === "allvsall") {
          type = "Todos vs Todos";
        } else type = "Eliminatória";
        return {
          inscritos: subscribed.length,
          torneio: {
            id: torneio.id,
            name: torneio.name,
            date_start: torneio.date_start,
            type: type,
            status: torneio.status,
            is_subscribed: active ? true : false,
            usuario: {
              usuarioId: torneio.usuario.id,
              username: torneio.usuario.username,
              countryImg: bandeira,
            },
          },
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
      return res.status(200).json({
        status: true,
        msg: "Este usuário já está inscrito neste torneio",
      });
    }
    if (usuarioId === torneio.usuarioId) {
      return res.status(400).json({
        status: false,
        msg: "Usuário não pode se inscrever no próprio torneio",
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
    const new_subscribed = await Usuario.findOne({
      where: { id: usuarioId },
      attributes: ["id", "username", "country"],
    });
    const bandeira = await getCountry(new_subscribed.country);

    const data = {
      id: torneio.id,
      name: torneio.name,
      date_start: torneio.date_start,
      type: torneio.type,
      status: torneio.status,
      is_subscribed: false,
      usuario: {
        id: new_subscribed.id,
        username: new_subscribed.username,
        countryImg: bandeira,
      },
    };
    const io = req.app.get("socketio");
    io.emit("new_subscribed", data);
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
    const confrontos = await vs.findAll({
      where: { torneioId: torneioId },
    });
    //pegar o usuername dos jogadores
    const PartidasUser = await Promise.all(
      confrontos.map(async (partida) => {
        const jogador1 = await Usuario.findByPk(partida.jogador1Id);
        const jogador2 = await Usuario.findByPk(partida.jogador2Id);
        return {
          winner: partida.winner || "0",
          jogador1: {
            username: jogador1.username,
            countryImg: await getCountry(jogador1.country),
          },
          jogador2: {
            username: jogador2.username,
            countryImg: await getCountry(jogador2.country),
          },
        };
      })
    );
    const io = req.app.get("sockeio");
    io.emit("partidas_geradas", PartidasUser);
    return res.status(200).json({
      status: true,
      msg: "Partidas geradas com sucesso",
      //data : PartidasUser,
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

    if (torneio.type !== "eliminatoria") {
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

    //pegar o usuername dos jogadores
    const PartidasUser = await Promise.all(
      this_partidas.map(async (partida) => {
        const jogador1 = await Usuario.findByPk(partida.jogador1Id);
        const jogador2 = await Usuario.findByPk(partida.jogador2Id);
        return {
          winner: partida.winner || "0",
          jogador1: {
            username: jogador1.username,
            countryImg: await getCountry(jogador1.country),
          },
          jogador2: {
            username: jogador2.username,
            countryImg: await getCountry(jogador2.country),
          },
        };
      })
    );
    const io = req.app.get("sockeio");
    io.emit("partidas_geradas", PartidasUser);
    res.status(200).json({
      status: true,
      msg: "Partidas geradas com sucesso",
      //data: PartidasUser,
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
    const new_torneio = await Torneio.update(
      { status: "closed" },
      {
        where: {
          id: torneioId,
        },
      }
    );
    const io = req.app.get("socketio");
    io.emit("status_torneio", new_torneio);
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
          winner: partida.winner || "0",
          jogador1: {
            username: jogador1.username,
            countryImg: await getCountry(jogador1.country),
          },
          jogador2: {
            username: jogador2.username,
            countryImg: await getCountry(jogador2.country),
          },
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
        msg: "Nem um usuário inscritos no torneio",
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
    const torneios = await Torneio.findByPk(torneioId);
    if (!torneios || !username || !vsId) {
      return res.status(400).json({
        status: false,
        msg: "Dados inválidos",
      });
    }
    const type = torneios.type;
    const user = await Usuario.findOne({
      where: { username },
    });
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
      { winner: username },
      {
        where: { id: vsId },
      }
    );
    if (type === "eliminatoria") {
      const partida = await vs.findByPk(vsId);

      if (partida.jogador1Id != user.id) {
        const new_torneio = await Torneio.findByPk(torneioId);
        await user_toneio.update(
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
        await user_toneio.update(
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

    // find o confronto
    const vencedor = await vs.findOne({
      id: vsId,
    });
    //pegar o usuername dos jogadores
    const PartidasUser = await Promise.all(
      vencedor.map(async (partida) => {
        const jogador1 = await Usuario.findByPk(partida.jogador1Id);
        const jogador2 = await Usuario.findByPk(partida.jogador2Id);
        return {
          winner: partida.winner || "0",
          jogador1: {
            username: jogador1.username,
            countryImg: await getCountry(jogador1.country),
          },
          jogador2: {
            username: jogador2.username,
            countryImg: await getCountry(jogador2.country),
          },
        };
      })
    );

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
        return {
          username: usuario.username,
          countryImg: await getCountry(user.country),
          pontos: user.pontos,
        };
      })
    );

    // ranking individual do usuário
    const filteredRanking = await aux.ft_ranking(user.id, res, req);

    // obter a instancia do socket.io
    const io = req.app.get("socketio");
    io.emit("select_winner", PartidasUser);
    io.emit("top_users", topUsers);
    io.emit("ranking_individual", filteredRanking);
    io.emit("ranking_torneio", ranking_data);
    return res.status(200).json({
      status: true,
      msg: "Vencedor atualizado com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: [
        {
          msg: "Erro ao selecionar o vencedor",
        },
      ],
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
          countryImg: await getCountry(user.country),
          pontos: user.pontos,
        };
      })
    );
    return res.status(200).json({
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

exports.describeUser = async (req, res) => {
  try {
    const userId = req.userId;
    const userTargetId = req.params.userId;
    const torneioId = req.params.torneioId;
    const userAuth = await Usuario.findByPk(userId);

    const userTarget = await Usuario.findByPk(userTargetId);
    const torneioTarget = await Torneio.findByPk(torneioId);
    if (!userTarget || !torneioTarget) {
      return res.status(404).json({
        status: false,
        msg: "Dados inválidos",
      });
    }

    const torneio = await Torneio.findByPk(torneioId);
    if (!torneio) {
      return res.status(404).json({
        status: false,
        msg: "Torneio não encontrado",
      });
    }

    if (userAuth.id !== torneio.usuarioId) {
      return res.status(403).json({
        status: false,
        msg: "Usuário não autorizado",
      });
    }
    const findGamer = await user_toneio.findOne({
      where: {
        usuarioId: userTargetId,
        torneioId,
      },
    });
    if (!findGamer) {
      return res.status(404).json({
        status: false,
        msg: "Usuário não está inscrito inscrito no torneio",
      });
    }
    await user_toneio.destroy({
      where: {
        usuarioId: userTargetId,
        torneioId,
      },
    });
    return res.status(200).json({
      status: true,
      msg: "Usuário desclassificado com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Erro ao tentar desclassificar usuário",
    });
  }
};

exports.outTorneio = async (req, res) => {
  try {
    const userId = req.userId;
    const torneioId = req.params.torneioId;
    const user = await Usuario.findByPk(userId);
    const torneio = await Torneio.findByPk(torneioId);
    if (!user || !torneio) {
      return res.status(404).json({
        status: false,
        msg: "Dados inválidos",
      });
    }
    const findGamer = await user_toneio.findOne({
      where: {
        usuarioId: userId,
        torneioId,
      },
    });
    if (!findGamer) {
      return res.status(404).json({
        status: false,
        msg: "Usuário não está inscrito inscrito no torneio",
      });
    }
    if (userId !== user.id) {
      return res.status(403).json({
        status: false,
        msg: "Usuário não autorizado",
      });
    }
    await user_toneio.destroy({
      where: {
        usuarioId: userId,
        torneioId,
      },
    });
    return res.status(200).json({
      status: true,
      msg: "Este usuário saio desse torneio",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Erro ao tentar desclassificar usuário",
    });
  }
};

exports.rankings = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;
    const filteredRanking = await aux.ft_ranking(usuarioId, res, req);
    return res.status(200).json({
      status: true,
      msg: "Ranking do usuário",
      data: filteredRanking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      msg: "Erro ao buscar ranking do usuário",
      error: error.message,
    });
  }
};
