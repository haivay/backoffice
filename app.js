import express from 'express';
import bodyParser from 'body-parser';
import * as ut from './utils.js';

const app = express()
const port = 3000
ut.client.connect();

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
  try {
    res.status(200).send(await ut.getForms());
  } catch (error) {
    console.log(error);
  }   
});

app.post('/getForm', async (req, res) => {
  const formId = req.body.formId;
  try {
    res.status(200).send(await ut.getForm(formId));
  } catch (error) {
    console.log(error);
  };
});

app.post('/saveForm', async (req, res) =>{
  const formName = req.body.formName;
  const formFields = JSON.stringify(req.body.formFields);
  const staffId = req.body.staffId;
  try {
    await ut.saveForm(formName, formFields, staffId);
  } catch (error) {
    console.log(error);
  };
});

app.post('/updateForm', async (req, res) =>{
  const id = req.body.id;
  const formName = req.body.formName;
  const formFields = JSON.stringify(req.body.formFields);
  const staffId = req.body.staffId;
  try {
    await ut.updateForm(id, formName, formFields, staffId);
  } catch (error) {
    console.log(error);
  };
})

app.post('/deleteForm', async (req, res) =>{
  const id = req.body.id;
  try {
    await ut.deleteForm(id);
  } catch (error) {
    console.log(error);
  };
})

app.post('/getRequests', async (req, res) => {
  const typeId = req.body.id;
  const filterParts = [];
  if(req.body.filters != null){
    const filters = req.body.filters;
  for (const field in filters) {
    filterParts.push(`${field}::text ILIKE '%${filters[field]}%'`);
  }
  }
  const filterStatement = filterParts.join(' AND ');
  console.log(filterParts);
  try {
    res.status(200).send(await ut.getRequests(typeId, filterStatement));
  } catch (error) {
    console.log(error);
  };
});

app.post('/saveRequest', async (req, res) =>{
  const typeFormId = req.body.id;
  const formData = JSON.parse(req.body.data);
  const personId = req.body.personId;
  try {
    res.status(200).send(await ut.saveRequest(typeFormId, formData, personId));
  } catch (error) {
    console.log(error);
  };
});

app.post('/deleteRequest', async (req, res) =>{
  const id = req.body.id;
  try {
    await ut.deleteRequest(id);
  } catch (error) {
   console.log(error); 
  };
});

app.post('/getStaff', async (req, res) => {
  try {
    res.status(200).send(await ut.getStaff());
  } catch (error) {
    console.log(error);
  };
});

app.post('/getStaffById', async (req, res) => {
  staffId = req.body.staffId;
  try {
    res.status(200).send(await ut.getStaffById(staffId));
  } catch (error) {
    console.log(error);
  };
});

app.post('/getStatuses', async (req, res) => {
  try {
    res.status(200).send(await ut.getStatuses());
  } catch (error) {
    console.log(error);
  };
});

app.post('/getCategories', async (req, res) => {
  try {
    res.status(200).send(await ut.getCategories());
  } catch (error) {
    console.log(error);
  };
});

app.post('/getPriorities', async (req, res) => {
  try {
    res.status(200).send(await ut.getPriorities());
  } catch (error) {
    console.log(error);
  };
});

app.post('/saveAnswer', async (req, res) =>{
  const status_id = req.body.status_id;
  const category_id = req.body.category_id;
  const priority_id = req.body.priority_id;
  const answer = req.body.answer;
  const request_id = req.body.request_id;
  try {
    await ut.saveAnswer(status_id, category_id, priority_id, answer, request_id);
  } catch (error) {
    console.log(error);
  };
});

app.post('/getAnswerByRequestNumber', async (req, res) =>{
  const requestNumber = req.body.requestNumber;
  try {
    res.status(200).send(await ut.getAnswerByRequestNumber(requestNumber));
  } catch (error) {
    console.log(error);
  };
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});