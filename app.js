import express from 'express';
import pkg from 'pg';
const { Client } = pkg;
import path from 'path'
import serveStatic from 'serve-static';
import bodyParser from 'body-parser';

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
app.use(express.static(path.join(__dirname, './public')));

app.use(bodyParser.json({
  limit: '500mb',
  parameterLimit:50000
}))
app.use(bodyParser.urlencoded({
  limit: '500mb',
  parameterLimit: 50000,
  extended: true
}))

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/getForms', (req, res) => {
  const query = 'SELECT * FROM practice.tblformtypes';
  client.query(query, (err, data) => {
    if (err) return console.log(err);
    // console.log(data.rows);
    // res = data.rows;
    res.status(200).send(data.rows)
  })
})

app.post('/saveForm', async(req, res) =>{
  const formName = req.body.formName;
  const formFields = JSON.stringify(req.body.formFields);
  const query = "INSERT INTO practice.tblformtypes(type_name, document_fields) VALUES ($1, $2)";
  client.query(query, [formName, formFields], (err, data) =>{
    if (err) return console.error(err);
  })
})

app.post('/deleteForm', async(req, res) =>{
  // const id = req.body.id
  const formName = req.body.formName;
  const query = "DELETE FROM practice.tblformtypes WHERE type_name=$1;";
  client.query(query, [formName], (err, data) =>{
    if (err) return console.error(err);
  })
})

app.post('/testTry', (req, res) => {
  const formId = req.body.formId;
  const query = 'SELECT * FROM practice.tblformtypes WHERE id = $1';
  client.query(query, [formId], (err, data) => {
    if (err) return console.log(err);
    // console.log(data.rows[0]);
    res.status(200).send(data.rows[0])
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})