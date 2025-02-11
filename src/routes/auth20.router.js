const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("../../models/index.js");
const Usuario = db.Usuario;
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }) // Pedir acesso ao perfil e email
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    // Login bem-sucedido
    const findUser = await Usuario.findOne({
      where: { email: req.user._json.email },
    });
    if (!findUser) {
      const randomdigits = Math.floor(Math.random() * 9000).toString();
      const newUsername = `${req.user._json.given_name}_${randomdigits}`;
      const createUser = await Usuario.create({
        username: newUsername,
        email: req.user._json.email,
        password: "",
        country: "Angola",
      });
      if (!createUser) {
        return res.status(500).json({
          status: false,
          msg: "Erro ao criar usuário",
        });
      }
    }
    const finNewUser = await Usuario.findOne({
      where: { email: req.user._json.email },
    });
    const data = {
      id: finNewUser.id,
      username: finNewUser.username,
    }
    const token = jwt.sign(
      {
        data,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    //res.cookie("jwt", token, { httpOnly: true });
   
    return res.redirect(`http://localhost:3000/googleAuth?token=${token}&usuarioId=${data.id}&username=${data.username}`);
  }
);

module.exports = router;
