// src/controllers/users.controller.js

const { Op } = require('sequelize')
const db = require('../../models') // Importa todos os modelos
const Usuario = db.Usuario // Acessa o modelo Usuario
const Torneio = db.Torneio // Acessa o modelo Torneio
const Teams = db.Teams
const UsuarioTorneio = db.UsuarioTorneio // Acessa o modelo UsuarioTorneio
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const axios = require('axios')

async function getCountryFlag (country) {
  try {
    const bandeira = await axios.get(
      `https://restcountries.com/v3.1/name/${country}`
    )
    if (!bandeira.data || bandeira.data.length === 0) {
      return 0
    }
    return bandeira.data[0].flag
  } catch (error) {
    return 0
  }
}

exports.createUsuario = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        errors: errors.array()
      })
    }
    const { username, email, password, country } = req.body
    const usuarioExistente = await Usuario.findOne({
      where: { email }
    })

    if (usuarioExistente) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            value: email,
            msg: 'Usuário já existe, tenta mudar o username ou email',
            param: 'email ou  username',
            location: 'body'
          }
        ]
      })
    }

    const bandeira = await getCountryFlag(country)
    if (bandeira == 0) {
      return res.status(404).json({
        status: false,
        errors: [
          {
            value: country,
            msg: 'País não encontrado',
            param: 'country',
            location: 'body'
          }
        ]
      })
    }

    const usuario = await Usuario.create({
      username,
      email,
      password: bcrypt.hashSync(password, 10),
      country: country || 'Angola'
    })
    const {
      id: idRes,
      username: usernameRes,
      email: emailRes,
      pontos
    } = usuario

    const data = {
      id: idRes,
      username: usernameRes,
      email: emailRes,
      country: country || 'Angola',
      countryImg: bandeira,
      pontos
    }
    const io = req.app.get('socketio')
    io.emit('create_user', data) //emitindo evento
    return res.status(201).json({
      status: true,
      msg: 'Usuário criado com sucesso',
      data
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      errors: [
        {
          msg: error.message
        }
      ]
    })
  }
}

exports.getUsuarios = async (req, res) => {
  try {
    const maxLen = req.query.maxLen || 3
    const order = req.query.order || 'ASC'
    const offset = req.query.offset || 0
    const search = req.query.search || ''
    const attribute = req.query.attribute || 'id'
    const len_users = await Usuario.count({
      where: {
        tipo_usuario: 'normal'
      }
    })

    const usuarios = await Usuario.findAll({
      attributes: [
        'id',
        'username',
        'email',
        'pontos',
        'country',
        'createdAt',
        'updatedAt'
      ],
      where: {
        [Op.like]: `%${search}%`
      },
      order: [[attribute, order]],
      limit: maxLen,
      offset: offset,
      where: {
        tipo_usuario: 'normal'
      }
    })

    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({
        status: false,
        errors: [
          {
            msg: 'Nenhum usuário encontrado',
            param: 'all',
            location: 'body'
          }
        ]
      })
    }

    const data = await Promise.all(
      usuarios.map(async usuario => {
        const bandeira = await getCountryFlag(usuario.country)
        return {
          id: usuario.id,
          username: usuario.username,
          email: usuario.email,
          country: usuario.country,
          countryImg: bandeira,
          pontos: usuario.pontos,
          createdAt: usuario.createdAt,
          updatedAt: usuario.updatedAt
        }
      })
    )
    req.io.emit('listar_usuarios', data)
    return res.status(200).json({
      status: true,
      msg: 'Usuários encontrados',
      len_users,
      data
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      errors: [
        {
          msg: 'Erro ao buscar usuários',
          param: 'all',
          location: 'body'
        }
      ]
    })
  }
}

exports.deleteUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id
    const { password } = req.body
    const usuario = await Usuario.findByPk(usuarioId)

    if (!usuario) {
      return res.status(404).json({
        status: false,
        errors: [
          {
            msg: 'Usuário não encontrado',
            param: 'id',
            location: 'params'
          }
        ]
      })
    }

    if (req.userId !== usuario.id) {
      return res.status(403).json({
        status: false,
        errors: [
          {
            msg: 'Usuário não autorizado'
          }
        ]
      })
    }

    if (!password) {
      return res.status(400).json({
        status: false,
        msg: 'A senha é obrigatória'
      })
    }

    const is_valid = await bcrypt.compare(password, usuario.password)
    if (!is_valid) {
      return res.status(400).json({
        status: false,
        msg: 'Senha incorreta'
      })
    }

    // Deletando dados relacionados primeiro
    await Torneio.destroy({ where: { usuarioId } })
    await UsuarioTorneio.destroy({ where: { usuarioId } })
    // await Teams.destroy({ where: { usuarioId } })

    // Deletando o usuário corretamente
    await usuario.destroy()

    return res.status(200).json({
      status: true,
      msg: 'Usuário deletado com sucesso'
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      errors: [
        {
          msg: 'Erro ao deletar usuário',
          error: error.message,
          param: 'all',
          location: 'body'
        }
      ]
    })
  }
}


exports.getUsuarioById = async (req, res) => {
  try {
    const usuarioId = req.params.id
    const usuario = await Usuario.findByPk(usuarioId, {
      attributes: [
        'id',
        'username',
        'email',
        'pontos',
        'country',
        'createdAt',
        'updatedAt'
      ]
    })
    if (!usuario) {
      return res.status(404).json({
        status: false,
        errors: [
          {
            msg: 'Usuário não encontrado',
            param: 'id',
            location: 'params'
          }
        ]
      })
    }
    const bandeira = await getCountryFlag(usuario.country)
    return res.status(200).json({
      status: true,
      msg: 'Usuário encontrado',
      data: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        country: usuario.country,
        countryImg: bandeira,
        pontos: usuario.pontos,
        createdAt: usuario.createdAt,
        updatedAt: usuario.updatedAt
      }
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      errors: [
        {
          msg: 'Erro ao buscar usuário',
          param: 'all',
          location: 'body'
        }
      ]
    })
  }
}

exports.updateUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id
    const usuario = await Usuario.findByPk(usuarioId)
    const { username, email, newPassword, oldPassword, country } = req.body
    if (!usuario) {
      return res.status(404).json({
        status: false,
        errors: [
          {
            msg: 'Usuário não encontrado',
            param: 'id',
            location: 'params'
          }
        ]
      })
    }
    if (req.userId !== usuario.id) {
      return res.status(403).json({
        status: false,
        errors: [
          {
            msg: 'Usuário não autorizado'
          }
        ]
      })
    }
    if (oldPassword && !bcrypt.compareSync(oldPassword, usuario.password)) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            msg: 'Senha antiga incorreta'
          }
        ]
      })
    }
    if ((oldPassword && !newPassword) || (newPassword && !oldPassword)) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            msg: 'Senha antiga e nova senha são obrigatórias'
          }
        ]
      })
    }
    if (newPassword && newPassword.length < 6) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            msg: 'Nova senha deve ter no mínimo 4 caracteres'
          }
        ]
      })
    }
    const usuarioExistente = await Usuario.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
        id: {
          [Op.ne]: usuarioId
        }
      }
    })
    if (usuarioExistente) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            value: email,
            msg: 'Este usuário já existe',
            param: 'email ou username',
            location: 'body'
          }
        ]
      })
    }

    const bandeira = await getCountryFlag(country)
    if (bandeira == 0) {
      return res.status(404).json({
        status: false,
        errors: [
          {
            value: country,
            msg: 'País não encontrado',
            param: 'country',
            location: 'body'
          }
        ]
      })
    }
    if (!oldPassword && !newPassword) {
      await usuario.update({
        username,
        email,
        country
      })
      return res.status(200).json({
        status: true,
        msg: 'Usuário atualizado com sucesso'
      })
    } else {
      await usuario.update({
        username,
        email,
        password: bcrypt.hashSync(newPassword, 10),
        country
      })
    }

    return res.status(200).json({
      status: true,
      msg: 'Usuário atualizado com sucesso'
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      errors: [
        {
          msg: 'Erro ao atualizar usuário',
          error: error.message,
          param: 'all',
          location: 'body'
        }
      ]
    })
  }
}
