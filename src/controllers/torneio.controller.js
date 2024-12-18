// src/controllers/torneioController.js

const db = require("../../models"); // Ajuste o caminho conforme necessário
const Torneio = db.Torneio; // Ajuste o caminho conforme necessário
const Usuario = db.Usuario; // Ajuste o caminho conforme necessário
const user_toneio = db.UsuarioTorneio; // Ajuste o caminho conforme necessário
const vs = db.Adversarios;
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.createTorneio = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { name, pass, usuarioId } = req.body;

    const torneio = await Torneio.create({
      name,
      pass: bcrypt.hashSync(pass, 10),
      usuarioId,
    });
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
    const torneios = await Torneio.findAll();
    res.status(200).json(torneios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.subcribeTorneio = async (req, res) => {
  try {
    const { torneioId, usuarioId } = req.params;

    if (!torneioId || !usuarioId) {
      return res.status(400).json({
        status: false,
        msg: "Dados inválidos",
      });
    }
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
    const torneio = await Torneio.findByPk(torneioId);
    if (!torneio) {
      return res.status(404).json({ msg: "Torneio não encontrado" });
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
        msg: "Usuário removido do torneio",
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
    res.status(500).json({ error: error.message });
  }
};

exports.AllvsAll = async (req, res) => {
  try {
    const torneioId = req.params.torneioId;
    const jogadoresInscritos = await user_toneio.findAll({
      where: {
        torneioId: torneioId,
      },
    });

    if (jogadoresInscritos.length < 1) {
      return res.status(404).json({
        status: false,
        msg: "Nenhum jogador inscrito no torneio",
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
    const partidasVs = await vs.findAll({
      where: { torneioId: torneioId },
    });

    const PartidasUser = partidasVs.map(async (partida) => {
      const jogador1 = await Usuario.findByPk(partida.jogador1Id);
      const jogador2 = await Usuario.findByPk(partida.jogador2Id);
      return {
        jogador1: jogador1.username,
        jogador2: jogador2.username,
      };
    });
    return res.status(200).json({
      status: true,
      msg: "Partidas geradas com sucesso",
      //data: partidasVs,
      PartidasUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      partidas,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.winner = async (req, res) => {
  try {
    const { torneioId, username } = req.params;
    const jogador = await Usuario.findOne({
      where: { username },
    });
    
    const winner = Math.floor(Math.random() * 2) + 1;
    let winnerId = null;
    if (winner === 1) {
      winnerId = jogador1Id;
    } else {
      winnerId = jogador2Id;
    }
    const partida = await vs.update(
      { winnerId },
      {
        where: {
          jogador1Id,
          jogador2Id,
          torneioId,
        },
      }
    );
    res.status(200).json({
      status: true,
      msg: "Vencedor da partida",
      winnerId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

