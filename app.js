import express from 'express';
import { Client } from 'pg';

const app = express();

const client = new Client({
  user: 'backoffice',
  host: 'main.psaa.ru',
  database: 'db_backoffice',
  password: 'W30082021',
  port: '5432',
});
client.connect();

app.get('/', (req, res) => {
  let query = 'SELECT * FROM tblformtypes';
  console.log(client.query(query));
});

app.listen(3000, function() {
  console.log("смотрим работу через браузер - http://localhost:3000/");
  let isWin = process.platform === "win32";
  let hotKeys = isWin? "Ctrl+C": "Ctrl+D"; // Windows / Linux
  console.log(`остановить сервер - ${hotKeys}`);
});