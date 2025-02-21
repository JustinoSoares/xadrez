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
                Name: `Jogador`
              }
            ],
            Subject: 'Código para recuperação de senha',
            HTMLPart: `
            <div style="text-align: center;">
              <img src="https://res.cloudinary.com/dzpallmns/image/upload/v1740135918/pxj1dxbxxwx2xcejs7xi.png" alt="Logo Cavaleiro" style="width: 80px; height :; margin-bottom: 20px;">
              <h3>Olá jogador,</h3>
              <p>O seu código para recuperação de senha é:</p>
              <h2 style="color: #4f47e5;">${code}</h2>
            </div>
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
