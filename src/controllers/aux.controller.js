const db = require("../../models"); // Ajuste o caminho conforme necessário
const Torneio = db.Torneio; // Ajuste o caminho conforme necessário
const Usuario = db.Usuario; // Ajuste o caminho conforme necessário
const user_toneio = db.UsuarioTorneio; // Ajuste o caminho conforme necessário
const vs = db.Adversarios;
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const axios = require("axios");
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

async function ft_ranking(usuarioId, res, req) {
  try {
    const torneios_participados = await user_toneio.findAll({
      where: { usuarioId },
    });

    if (!torneios_participados.length) {
      return {
        status: false,
        msg: "Nenhum torneio encontrado para o usuário.",
      };
    }

    const ranking = await Promise.all(
      torneios_participados.map(async (torneio) => {
        // Buscar o torneio pelo ID
        const each_torneio = await Torneio.findByPk(torneio.torneioId);
        if (!each_torneio) {
          return null; // Ignora torneios inexistentes
        }

        // Buscar todos os usuários e suas pontuações para este torneio
        const ranking_for_each_user = await user_toneio.findAll({
          where: { torneioId: each_torneio.id },
          order: [["pontos", "DESC"]],
        });

        // Encontrar a posição do usuário no ranking
        const userRanking = ranking_for_each_user.findIndex(
          (user) => user.usuarioId === usuarioId
        );

        // Caso o usuário seja encontrado no ranking
        if (userRanking !== -1) {
          const user = ranking_for_each_user[userRanking];
          return {
            torneio: each_torneio.name, // Supondo que Torneio tenha o atributo 'name'
            pos: userRanking + 1,
            pontos: user.pontos,
          };
        }

        // Caso o usuário não esteja no ranking
        return null;
      })
    );

    // Filtrar torneios válidos
    const filteredRanking = ranking.filter((item) => item !== null);

    // Retornar ranking ou mensagem de vazio
    if (!filteredRanking.length) {
      return {
        status: false,
        msg: "Usuário não está classificado em nenhum torneio.",
      };
    }

    return {
      status: true,
      ranking: filteredRanking,
    };
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return {
      status: false,
      msg: "Erro interno ao buscar ranking.",
    };
  }
}


async function ft_rank_partida(torneioId, res, req) {
  const jogadores = await user_toneio.findAll({
    where: { torneioId },
    order: [["pontos", "DESC"]],
  });

  if (!jogadores.length) {
    return {
      status: false,
      msg: "Ranking Zerado",
    };
  }
  const ranking = await Promise.all(
    jogadores.map(async (list) => {
      // Buscar todos os usuários e suas pontuações para este torneio
      const user = await Usuario.findByPk(list.usuarioId);
      if (!user) return null;
      return {
        usuario: {
          usuarioId: user.id,
          username: user.username,
          countryImg: await getCountry(user.country),
          pontos: list.pontos,
        },
      };
    })
  );
  // Remover torneios onde o usuário não foi encontrado
  const filteredRanking = ranking.filter((item) => item.usuario.pontos > 0);
  return filteredRanking;
}

module.exports = { ft_ranking, ft_rank_partida };
