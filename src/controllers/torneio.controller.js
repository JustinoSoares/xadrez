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
const { Op, or, where } = require("sequelize");

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
    let { type } = req.body;
    const usuarioId = req.userId;

    const io = req.app.get("socketio");

    const torneio = await Torneio.create({
      name,
      date_start: date_start,
      type,
      pass: bcrypt.hashSync(pass, 10),
      usuarioId,
    });

    if (!torneio) {
      return res.status(400).json({
        status: false,
        msg: "Erro ao criar torneio",
      });
    }

    const user = await Usuario.findByPk(usuarioId);
    const subscribed = await user_toneio.findAll({
      where: {
        torneioId: torneio.id,
      },
    });

    const new_subs = await Promise.all(
      subscribed.map(async (sub) => {
        const user = await Usuario.findByPk(sub.usuarioId);
        const bandeira = await getCountry(user.country);
        return {
          usuarioId: user.id,
          pontos: user.pontos,
          username: user.username,
          countryImg: bandeira,
        };
      })
    );
    if (type === "allvsall") {
      type = "Todos vs Todos";
    } else type = "Eliminatória";
    const data = {
      inscritos: subscribed.length,
      torneio: {
        id: torneio.id,
        name: torneio.name,
        date_start: torneio.date_start,
        type: type,
        status: torneio.status,
        is_subscribed: false,
        usuario: {
          usuarioId: usuarioId,
          pontos: user.pontos,
          username: user.username,
          countryImg: await getCountry(user.country),
        },
        subscribed: {
          torneioId: torneio.id,
          subscribed: new_subs,
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
      torneio: {
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
    const search = req.query.search || "";
    const status = req.query.status || null;
    const userId = req.userId;
    const maxLen = req.query.maxLen || 10;
    const offset = req.query.offset || 0;
    const order = req.query.order || "DESC";
    const attribute = req.query.attribute || "createdAt";

    const whereConditional = {
      [Op.or]: [
        {
          name: {
            [db.Sequelize.Op.iLike]: `%${search}%`,
          },
        },
      ],
    };
    if (status) {
      whereConditional.status = status;
    }
    const len_torneio = await Torneio.count({
      where: whereConditional,
    });

    const torneios = await Torneio.findAll({
      where: whereConditional,
      limit: maxLen,
      offset: offset,
      order: [[attribute, order]],
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "username", "country", "pontos"],
        },
      ],
    });

    const userSubscribed = await Promise.all(
      torneios.map(async (torneio) => {
        const bandeira = await getCountry(torneio.usuario.country);
        //
        const user_subscribed = await user_toneio.findAll({
          where: {
            torneioId: torneio.id,
          },
        });

        const new_subs = await Promise.all(
          user_subscribed.map(async (sub) => {
            const user = await Usuario.findByPk(sub.usuarioId);
            const bandeira = await getCountry(user.country);
            return {
              usuarioId: user.id,
              pontos: user.pontos,
              username: user.username,
              countryImg: bandeira,
            };
          })
        );
        //

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
              pontos: torneio.usuario.pontos,
              username: torneio.usuario.username,
              countryImg: bandeira,
            },
            subscribed: {
              torneioId: torneio.id,
              subscribed: new_subs,
            },
          },
        };
      })
    );
    res.status(200).json({
      status: true,
      msg: "Todos torneios",
      len_torneio: len_torneio,
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

    const torneio = await Torneio.findByPk(torneioId);
    if (!torneio) {
      return res.status(404).json({
        status: false,
        msg: "Torneio não encontrado",
      });
    }
    if (!pass) {
      return res.status(400).json({
        status: false,
        msg: "Dados inválidos",
      });
    }
    if (torneio.status !== "open") {
      return res.status(400).json({
        status: false,
        msg: "Impossível, torneio encerrado!",
      });
    }

    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({
        status: false,
        msg: "Usuário não encontrado",
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
      where: { id: torneio.usuarioId },
      attributes: ["id", "username", "country", "pontos"],
    });
    const bandeira = await getCountry(new_subscribed.country);

    const subscribed = await user_toneio.findAll({
      where: {
        torneioId: torneio.id,
      },
    });

    //
    const user_subscribed = await user_toneio.findAll({
      where: {
        torneioId: torneio.id,
      },
    });

    const new_subs = await Promise.all(
      user_subscribed.map(async (sub) => {
        const user = await Usuario.findByPk(sub.usuarioId);
        const bandeira = await getCountry(user.country);
        return {
          usuarioId: user.id,
          username: user.username,
          countryImg: bandeira,
        };
      })
    );
    //

    const active = await user_toneio.findOne({
      where: {
        usuarioId: usuarioId,
        torneioId: torneio.id,
      },
    });
    let type = torneio.type;
    if (type === "allvsall") {
      type = "Todos vs Todos";
    } else type = "Eliminatória";
    const data = {
      inscritos: subscribed.length,
      torneio: {
        id: torneio.id,
        name: torneio.name,
        date_start: torneio.date_start,
        type: type,
        status: torneio.status,
        is_subscribed: active ? true : false,
        usuario: {
          usuarioId: new_subscribed.id,
          pontos: new_subscribed.pontos,
          username: new_subscribed.username,
          countryImg: bandeira,
        },
        subscribed: {
          torneioId: torneio.id,
          subscribed: new_subs,
        },
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
      error: error.message,
      msg: "Erro ao inscrever usuário no torneio",
    });
  }
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
    const old_torneio = await Torneio.findByPk(torneioId);
    if (!old_torneio) {
      return res.status(400).json({
        status: false,
        msg: "Este torneio não existe",
      });
    }
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
    let type = old_torneio.type;
    if (type === "allvsall") {
      type = "Todos vs Todos";
    } else type = "Eliminatória";

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

    data = {
      status: true,
      msg: "Todas partidas do torneio",
      torneio: {
        inscritos: subcribe.length,
        usuarioId: old_torneio.usuarioId,
        torneioId: old_torneio.id,
        name: old_torneio.name,
        date_start: old_torneio.date_start,
        type: type,
        status: old_torneio.status,
      },
      PartidasUser: agruparPorRodada(PartidasUser),
      //PartidasUser: PartidasUser.sort((a, b) => a.vsId - b.vsId),
    };
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
      msg: "Erro ao gerar partidas",
    });
  }
};

exports.subscribed = async (req, res) => {
  try {
    const maxLen = req.query.maxLen || 3;
    const offset = req.query.offset || 0;
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
      data: userSubscribed.slice(offset, maxLen),
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
        await Torneio.update(
          { status: "closed" },
          {
            where: {
              id: torneioId,
            },
          }
        );
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
        await Torneio.update(
          { status: "closed" },
          {
            where: {
              id: torneioId,
            },
          }
        );
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
      PartidasUser: PartidasUser.sort((a, b) => a.vsId - b.vsId),
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

    const usuario = Usuario.findByPk(userTargetId);
    const subscribed = await user_toneio.findAll({
      where: {
        torneioId: torneio.id,
      },
    });
    const data = {
      inscritos: subscribed.length,
      tornnio: {
        id: torneio.id,
        name: torneio.name,
        date_start: torneio.date_start,
        type: torneio.type,
        status: torneio.status,
        usuario: {
          usuarioId: usuario.id,
          usurname: usuario.username,
          countryImg: await getCountry(usuario.country),
        },
      },
    };
    const io = req.app.get("socketio");
    io.emit("cancelar_participacao", data);
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

    const usuario = await Usuario.findByPk(torneio.usuarioId);
    const data_user = {
      usuarioId: usuario.id,
      username: usuario.username,
      countryImg: await getCountry(usuario.country),
    };
    await user_toneio.destroy({
      where: {
        usuarioId: userId,
        torneioId,
      },
    });
    const subscribed = await user_toneio.findAll({
      where: {
        torneioId: torneio.id,
      },
    });

    //
    const user_subscribed = await user_toneio.findAll({
      where: {
        torneioId: torneio.id,
      },
    });

    const new_subs = await Promise.all(
      user_subscribed.map(async (sub) => {
        const user = await Usuario.findByPk(sub.usuarioId);
        const bandeira = await getCountry(user.country);
        return {
          usuarioId: user.id,
          pontos: user.pontos,
          username: user.username,
          countryImg: bandeira,
        };
      })
    );

    let type = torneio.type;
    if (type === "allvsall") {
      type = "Todos vs Todos";
    } else type = "Eliminatória";
    const data = {
      inscritos: subscribed.length,
      torneio: {
        id: torneio.id,
        name: torneio.name,
        date_start: torneio.date_start,
        is_subscribed: false,
        type: type,
        status: torneio.status,
        usuario: data_user,
        subscribed: {
          torneioId: torneio.id,
          subscribed: new_subs,
        },
      },
    };
    const io = req.app.get("socketio");
    io.emit("cancelar_participacao", data);
    return res.status(200).json({
      status: true,
      msg: "Este usuário saio desse torneio",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Erro ao tentar desclassificar usuário",
      error: error.message,
    });
  }
};

exports.rankings = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;
    const user = await Usuario.findByPk(usuarioId);
    if (!user) {
      return res.status(404).json({
        status: false,
        msg: "Usuário não encontrado",
      });
    }
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

exports.rank_partida = async (req, res) => {
  try {
    const torneioId = req.params.torneioId;
    const filteredRanking = await aux.ft_rank_partida(torneioId, res, req);
    const data = {
      status: true,
      msg: "Ranking do Torneio",
      rank: filteredRanking,
    };
    const io = req.app.get("socketio");
    io.emit("rank_torneio", data);
    return res.status(200).json({
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      msg: "Erro ao buscar ranking do Torneio",
      error: error.message,
    });
  }
};

exports.torneiosUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;
    const attribute = req.query.attribute || "createdAt";
    const order = req.query.order || "DESC";
    const status = req.query.status || null;

    const whereConditional = {
      usuarioId: usuarioId,
    };
    if (status) {
      whereConditional.status = status;
    }
    const torneios = await Torneio.findAll({
      where: whereConditional,
      order: [[attribute, order]],
    });
    const data = await Promise.all(
      torneios.map(async (torneio) => {
        const user = await Usuario.findByPk(torneio.usuarioId);
        const inscritos = await user_toneio.findAll({
          where: {
            torneioId: torneio.id,
          },
        });
        const bandeira = await getCountry(user.country);
        let type = torneio.type;
        if (type === "allvsall") {
          type = "Todos vs Todos";
        } else type = "Eliminatória";
        return {
          id: torneio.id,
          name: torneio.name,
          inscritos: inscritos.length,
          date_start: torneio.date_start,
          type: type,
          status: torneio.status,
          usuario: {
            usuarioId: user.id,
            pontos: user.pontos,
            username: user.username,
            countryImg: bandeira,
          },
        };
      })
    );
    return res.status(200).json({
      status: true,
      msg: "Todos torneios do usuário",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      msg: "Erro ao buscar torneios do usuário",
      error: error.message,
    });
  }
};

exports.deleteTorneio = async (req, res) => {
  try {
    const torneioId = req.params.torneioId;
    const torneio = await Torneio.findByPk(torneioId);
    const usuarioId = req.userId;
    if (!torneio) {
      return res.status(404).json({
        status: false,
        msg: "Torneio não encontrado",
      });
    }
    if (torneio.status !== "closed") {
      return res.status(400).json({
        status: false,
        msg: "Torneio não encerrado",
      });
    }

    if (torneio.usuarioId !== usuarioId) {
      return res.status(403).json({
        status: false,
        msg: "Usuário não autorizado",
      });
    }
    await vs.destroy({
      where: {
        torneioId,
      },
    });
    await user_toneio.destroy({
      where: {
        torneioId,
      },
    });
    await Torneio.destroy({
      where: {
        id: torneioId,
      },
    });
    await user_toneio.destroy({
      where: {
        torneioId,
      },
    });
    await vs.destroy({
      where: {
        torneioId,
      },
    });
    return res.status(200).json({
      status: true,
      msg: "Torneio deletado com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      msg: "Erro ao deletar torneio",
      error: error.message,
    });
  }
};

exports.updateTorneio = async (req, res) => {
  try {
    const torneioId = req.params.torneioId;
    const usuarioId = req.userId;
    const { name, date_start, type } = req.body;
    const torneio = await Torneio.findByPk(torneioId);
    if (!torneio) {
      return res.status(404).json({
        status: false,
        msg: "Torneio não encontrado",
      });
    }
    if (torneio.usuarioId !== usuarioId) {
      return res.status(403).json({
        status: false,
        msg: "Usuário não autorizado",
      });
    }
    if (torneio.status !== "open") {
      return res.status(400).json({
        status: false,
        msg: "Torneio não pode ser alterado!",
      });
    }
    await Torneio.update(
      {
        name,
        date_start,
        type,
      },
      {
        where: {
          id: torneioId,
        },
      }
    );
    return res.status(200).json({
      status: true,
      msg: "Torneio atualizado com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      msg: "Erro ao atualizar torneio",
      error: error.message,
    });
  }
};
