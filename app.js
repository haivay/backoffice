import express from 'express';
import pkg from 'pg';
const { Client } = pkg;
import path from 'path'
import serveStatic from 'serve-static'

const app = express()
const port = 3000

const client = new Client({
  user: 'backoffice',
  host: 'main.psaa.ru',
  database: 'db_backoffice',
  password: 'W30082021',
  port: '5432',
});
client.connect();

const __dirname = path.resolve();
app.use('/', express.static(path.join(__dirname, '/src')));
app.use(serveStatic(__dirname + "/dist"));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./views/index.html'));
})

// app.get('/', (req, res) => {
//   let query = 'SELECT * FROM tblformtypes';
//   console.log(client.query(query));
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})