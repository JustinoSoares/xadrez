require("dotenv").config();
const express = require("express");
const { sequelize } = require("../models/index.js");
const usuarioRouter = require("./routes/user.router");
const torneioRouter = require("./routes/torneio.router");
const auth20Router = require("./routes/auth20.router");
const recoverRouter = require("./routes/recover.router");
const bodyParser = require("body-parser");
const cors = require("cors");
const backup = require("../backup.js");


const app = express();
//swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // Versão do OpenAPI
    info: {
      title: "Minha API de Xadrez", // Nome da API
      version: "1.0.0", // Versão da API
      description: "Documentação da API de Xadrez",
    },
    servers: [
      {
        url: "http://localhost:3000", // URL base da API
        description: "Servidor local",
      },
    ],
  },
  apis: ["./routes/*.js"], // Caminho para arquivos de rotas
};

// Gerar especificações do Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);
// Rota para exibir a documentação
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//real time

const http = require("http");
const { Server } = require("socket.io");

// oauth 2.0 google
const passport = require("passport");
const session = require("express-session");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");


//criar o servidor socket io
const server = http.createServer(app);
const port = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: "*", //permitir conexao de qualquer origem
  },
});
app.use(async (req, res, next) => {
  (req.io = io), // adiciona o socket.io ao objecto da requisição
    next();
});

app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);
  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});
app.use(
  cors({
    origin: "*", // Permitir apenas este domínio
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      //console.log(profile);
      done(null, profile);
    }
  )
);

//serialização do usuário e descerialização do usuário
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(
  session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
// Middleware(

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/", usuarioRouter);
app.use("/", torneioRouter);
app.use("/", auth20Router);
app.use("/", recoverRouter);

// Exportar o `app` para o Vercel

// Testar a conexão com o banco separadamente
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  })
  .catch((err) => {
    console.error("Não foi possível conectar ao banco de dados:", err);
  });

server.listen(port, () => {
  console.log(`Servidor rodando localmente na porta ${port}`);
});

//module.exports = app;
