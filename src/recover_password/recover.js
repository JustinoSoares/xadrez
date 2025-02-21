require('dotenv').config()
const { Model, DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailjet = require('node-mailjet')
const db = require('../../models') // Importa todos os modelos
const Usuario = db.Usuario

exports.send_code = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ msg: 'Preencha todos os campos!' })
    }
    const mailjetClient = await mailjet.apiConnect(
      process.env.API_KEY_MAILJET,
      process.env.SECRET_KEY_MAILJET
    )
    const code = Math.floor(100000 + Math.random() * 900000)
    const user = await Usuario.findOne({ where: { email } })
    if (!user) {
      return res
        .status(404)
        .json({ status: false, msg: 'Usuário não encontrado' })
    }
    user.code = `${code}`
    await user.save()
    const request = await mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.EMAIL_FROM,
              Name: `Cavaleiro`
            },
            To: [
              {
                Email: email,
                Name: `${user.username}`
              }
            ],
            Subject: 'Código para recuperação de senha',
            HTMLPart: `
            <!DOCTYPE html>
            <html lang="pt-br">
            <title>Online HTML Editor</title>

            <head>
            <meta charset="utf-8">
            </head>
          <body style="display: flex; justify-content: center; align-items: center;">
           <div style="text-align: center; margin-top: 50px">
                  <div style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 20px;
                  width: 100%;
                    "
            >
        <div style="display : flex; justify-content: center; align-items :center; gap: 5px;">
        <img
          src="https://res.cloudinary.com/dzpallmns/image/upload/v1740135918/pxj1dxbxxwx2xcejs7xi.png"
          alt="Logo Cavaleiro"
          style="width: 30px; height: 30px; margin: auto"
        />
        <h1>Cavaleiro</h1>
        </div>
      </div>
      <h3>Verificação da sua conta!</h3>
      <p>O seu código para recuperação de senha é:</p>
      <div
        style="
          padding: 2px 30px;
          margin-top: 20px;
          border-radius: 10px;
          border: 1px solid #ccc;
          display: inline-block;
        "
      >
        <h2 style="color: #4f47e5">${code}</h2>
      </div>
    </div>
    </body>
          `
          }
        ]
      })

    const response = await request
    return res.status(200).json({ msg: 'E-mail enviado com sucesso!' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Internal server error' })
  }
}

exports.confirm_code = async (req, res) => {
  try {
    const { email, code, new_password } = req.body
    if (!email || !code || !new_password) {
      return res.status(400).json({ msg: 'Preencha todos os campos!' })
    }
    const user = await Usuario.findOne({ where: { email } })
    if (!user) {
      return res
        .status(404)
        .json({ status: false, msg: 'Usuário não encontrado' })
    }
    if (user.code !== code) {
      return res.status(400).json({ msg: 'Código inválido' })
    }
    if (new_password.length < 6) {
      return res
        .status(400)
        .json({ msg: 'A senha deve ter no mínimo 6 caracteres' })
    }
    user.password = await bcrypt.hash(new_password, 10)
    user.code = null
    await user.save()
    return res.status(200).json({ msg: 'Senha alterada com sucesso!' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Internal server error' })
  }
}
