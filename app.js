import express from 'express';
import path from 'path'
import bodyParser from 'body-parser';
import * as ut from './utils.js';

const app = express()
const port = 3000
ut.client.connect();

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

app.post('/getForms', async (req, res) => {
    res.status(200).send(await ut.getForms())
})

app.post('/saveForm', async (req, res) =>{
  const formName = req.body.formName;
  const formFields = JSON.stringify(req.body.formFields);
  ut.saveForm(formName, formFields);
});

app.post('/deleteForm', async(req, res) =>{
  const id = req.body.id;
  console.log(id)
  const formName = req.body.formName;
  ut.deleteForm(id, formName);
})

app.post('/testTry', async (req, res) => {
  const formId = req.body.formId;
  res.status(200).send(await ut.testTry(formId));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
