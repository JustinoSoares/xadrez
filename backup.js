const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const cron = require('node-cron')

require('dotenv').config()

try {
  const DB_USER = process.env.DATABASE_USER // Usuário do banco de dados
  const DB_PASSWORD = process.env.DATABASE_PASSWORD // Senha do banco de dados
  const DB_NAME = process.env.DATABASE_NAME // Nome do banco de dados
  const DB_HOST = process.env.DATABASE_HOST // Host do banco de dados
  const BACKUP_DIR = path.join(__dirname, 'backups') // Diretório para armazenar backups

  // Criar a pasta de backup se não existir
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
  }

  cron.schedule(
    '0 3 * * *',
    () => {
      // Executa todos os dias às 03:00 AM
      const backupFile = path.join(BACKUP_DIR, `backup.sql`)
      // Comando para exportar o banco de dados PostgreSQL
      const dumpCommand = `PGPASSWORD=${DB_PASSWORD} pg_dump -U ${DB_USER} -h ${DB_HOST} -d ${DB_NAME} -F c -f ${backupFile}`

      exec(dumpCommand, (error, stdout, stderr) => {
        if (error) {
          console.error('Erro ao criar backup:', error)
          return
        }
        console.log('Backup criado com sucesso:', backupFile)
      })
    },
    {
      scheduled: true,
      timezone: 'America/Sao_Paulo' // Defina o fuso horário correto
    }
  )
  console.log('Tarefa de backup programada para 03:00 AM todos os dias.')
} catch (error) {
  console.error('Erro ao criar backup:', error)
}
