# Documentação da API

Esta API permite a gestão de torneios e usuários. Abaixo estão os endpoints disponíveis, suas funcionalidades e os dados esperados.

**URL_BASE**: `https://xadrez-git-master-justino-soares-projects.vercel.app`
## Endpoints de Torneios

### Criar Torneio

**URL:** `/torneios/create`  
**Método:** POST  
**Descrição:** Cria um novo torneio.  
**Headers:**
- Authorization: Bearer `token`  

**Body:**
```json
{
  "name": "Nome do Torneio",
  "pass": "Senha do Torneio",
  "date_start": "YYYY-MM-DD"
}
```
**Resposta de Sucesso:**
```json
{
  "status": true,
  "msg": "Torneio criado com sucesso",
  "data": { "id": 1, "name": "Torneio 1", ... }
}
```

---

### Listar Todos os Torneios

**URL:** `/torneios/all`  
**Método:** GET  
**Descrição:** Retorna uma lista de todos os torneios.  
**Query Params (opcionais):**
- `status`: Filtrar por status (ex.: "open", "closed").
- `search`: Filtrar por nome do torneio.

**Resposta de Sucesso:**
```json
{
  "status": true,
  "msg": "Todos torneios",
  "data": [ { "torneio": {"name": "Torneio 1"}, "inscritos": 5 }, ... ]
}
```

---

### Inscrever-se em um Torneio

**URL:** `/torneios/subscribe/:torneioId`  
**Método:** POST  
**Descrição:** Inscreve um usuário em um torneio.  
**Headers:**
- Authorization: Bearer `token`

**Body:**
```json
{
  "pass": "Senha do Torneio"
}
```
**Resposta de Sucesso:**
```json
{
  "status": true,
  "msg": "Inscrição realizada com sucesso"
}
```

---

### Gerar Partidas (Todos contra Todos)

**URL:** `/torneios/AllvsAll/:torneioId`  
**Método:** POST  
**Descrição:** Gera partidas para um torneio no modo "todos contra todos".  
**Headers:**
- Authorization: Bearer `token`

**Resposta de Sucesso:**
```json
{
  "status": true,
  "msg": "Partidas geradas com sucesso"
}
```

---

### Gerar Partidas (Eliminatória)

**URL:** `/torneios/eliminatoria/:torneioId`  
**Método:** POST  
**Descrição:** Gera partidas para um torneio no modo "eliminatoria".  
**Headers:**
- Authorization: Bearer `token`

**Resposta de Sucesso:**
```json
{
  "status": true,
  "msg": "Partidas geradas com sucesso"
}
```

---

### Listar Partidas de um Torneio

**URL:** `/torneios/partida/:torneioId`  
**Método:** GET  
**Descrição:** Lista todas as partidas de um torneio.

**Resposta de Sucesso:**
```json
{
  "status": true,
  "msg": "Todas partidas do torneio",
  "PartidasUser": [
    { "jogador1": "User1", "jogador2": "User2" }, ...
  ]
}
```

---

### Jogadores Inscritos em um Torneio

**URL:** `/torneios/subscribed/:torneioId`  
**Método:** GET  
**Descrição:** Lista todos os usuários inscritos em um torneio.

**Resposta de Sucesso:**
```json
{
  "status": true,
  "msg": "Jogadores inscritos",
  "data": [ {
    "username" : "jsoares",
    "countryImg": "bandeira",
  } ]
}
```

---

### Selecionar Vencedor

**URL:** `/torneios/select_winner/:torneioId/:username`  
**Método:** POST  
**Descrição:** Seleciona o vencedor de uma partida no torneio.

**Query Params (opcionais):**
- `type`: tipo de torneio (default: `allvsall`).
- se colocares eliminatória, ele apenas elimina
**Resposta de Sucesso:**
```json
{
  "status": true,
  "msg": "Vencedor selecionado com sucesso"
}
```

---

### Top Jogadores de um Torneio

**URL:** `/torneios/top/:torneioId`  
**Método:** GET  
**Descrição:** Retorna o ranking dos jogadores em um torneio.

**Resposta de Sucesso:**
```json
{
  "status": true,
  "msg": "Ranking do torneio",
  "data": [ { "username": "User1", "pontos": 10 }, ... ]
}
```

---

## Endpoints de Usuários

### Criar Usuário

**URL:** `/usuarios/create`  
**Método:** POST  
**Descrição:** Cria um novo usuário.

**Body:**
```json
{
  "username": "NomeDoUsuario",
  "password": "Senha",
  "email": "email@exemplo.com",
  "country": "País" (opcional)
}
```
**Resposta de Sucesso:**
```json
{
  "status": true,
  "msg": "Usuário criado com sucesso",
  "data": {
    "id": 1,
    "username": "NomeDoUsuario",
    "email": "email@exemplo.com",
    "country": "País",
    "pontos": 0
  }
}
```

---

### Listar Todos os Usuários

**URL:** `/usuarios/all`  
**Método:** GET  
**Descrição:** Retorna uma lista de todos os usuários cadastrados.

**Query Params (opcionais):**
- `maxLen`: Número máximo de usuários a serem retornados (default: 3).
- `order`: Ordem dos resultados (ASC ou DESC, default: ASC).
- `offset`: Posição inicial para retorno dos usuários (default: 0).
- `search`: Busca por nome de usuário.
- `attribute`: Atributo de ordenação (default: id).

**Resposta de Sucesso:**
```json
{
  "status": true,
  "msg": "Usuários encontrados",
  "data": [
    {
      "id": 1,
      "username": "User1",
      "email": "user1@exemplo.com",
      "pontos": 100,
      "country": "Angola",
      "countryImg": "🇦",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    },
    ...
  ]
}
```

---

### Login de Usuário

**URL:** `/usuarios/login`  
**Método:** POST  
**Descrição:** Realiza login de um usuário.

**Body:**
```json
{
  "username": "NomeDoUsuario",
  "password": "Senha"
}
```
**Resposta de Sucesso:**
```json
{
  "status": true,
  "id" : "id",
  "username" : "username" 
  "token": "Bearer token"
}
```

---

### Login com o google

**URL:** `/auth/google`  
**Método:** GET
**Descrição:** Realiza login de um usuário com o google.

**Resposta de Sucesso:**
```json
{
  "status": true,
  "id" : "id",
  "username" : "username" 
  "token": "Bearer token"
}
```

---


### Pegar cada usuário pelo ID

**URL:** `/usuarios/each/:id`  
**Método:** GET
**Descrição:** Retorna o usuário específico.

**Resposta de Sucesso:**
```json
{
  "status": true,
  "msg": "Usuários encontrados",
  "data": [
    {
      "id": 1,
      "username": "User1",
      "email": "user1@exemplo.com",
      "pontos": 100,
      "country": "Angola",
      "countryImg": "🇦",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    },
    ...
  ]
}
```

### Deletar usuário

**URL:** `/usuarios/delete/:id`
**Método:** DELETE
**Descrição:** Realiza login de um usuário.

**Resposta de Sucesso:**
```json
{
  "status": true,
  "msg": "Usuario deletado com sucesso"
}
```
