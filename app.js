import express from 'express';
import path from 'path'
import bodyParser from 'body-parser';
import * as ut from './utils.js';

const app = express()
const port = 3000
ut.client.connect();

const __dirname = path.resolve();

// app.use(express.static(path.join(__dirname, './public')));

// app.get('/', (req,res) => {
//   res.sendFile(path.join(__dirname, './public/index.html'));
// });

app.use('/', express.static(path.join(__dirname, '/dist')));

app.get('/data', (req,res) => {
  res.sendFile(path.join(__dirname, './dist/data.html'));
});

app.use(bodyParser.json({
  limit: '500mb',
  parameterLimit:50000
}))
app.use(bodyParser.urlencoded({
  limit: '500mb',
  parameterLimit: 50000,
  extended: true
}))

app.post('/getForms', async (req, res) => {
    res.status(200).send(await ut.getForms());
});

app.post('/data/getForms', async (req, res) => {
  res.status(200).send(await ut.getForms());
});

app.post('/getData', async(req, res) => {
  const typeId = req.body.id;
  res.status(200).send(await ut.getData(typeId));
});

app.post('/saveForm',(req) =>{
  const formName = req.body.formName;
  const formFields = JSON.stringify(req.body.formFields);
  ut.saveForm(formName, formFields);
});

app.post('/sendData', (req) => {
  const typeFormId = req.body.id;
  const formData = req.body.data;
  ut.sendData(typeFormId, formData);
});

app.post('/updateForm',(req) =>{
  const id = req.body.id;
  const formName = req.body.formName;
  const formFields = JSON.stringify(req.body.formFields);
  ut.updateForm(id, formName, formFields);
})

app.post('/deleteForm',(req) =>{
  const id = req.body.id;
  ut.deleteForm(id);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})