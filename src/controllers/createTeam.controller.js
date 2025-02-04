const db = require("../../models"); // Ajuste o caminho conforme necessário
const Team = db.Team; // Ajuste o caminho conforme necessário

exports.createTeam = async (req, res) => {
  try {
    const torneioId = req.params.torneioId;
    const usuarioId = req.userId;

    const { name } = req.body;
    const team = await Team.create({
      name,
      usuarioId,
      torneioId,
    });
    return res.status(201).json({
      status: true,
      team,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      msg: "Erro ao criar time",
      error: error.message,
    });
  }
};
