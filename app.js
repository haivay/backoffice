import express from 'express';
import bodyParser from 'body-parser';
import pkg from 'pg';
const { Client } = pkg;

const bdParams = {
  user: 'backoffice',
  host: 'main.psaa.ru',
  database: 'db_backoffice',
  password: 'W30082021',
  port: '5432',
};
const client = new Client(bdParams);

const app = express()
const port = 3000
client.connect();

app.use(bodyParser.json({
  limit: '500mb',
  parameterLimit:50000
}))
app.use(bodyParser.urlencoded({
  limit: '500mb',
  parameterLimit: 50000,
  extended: true
}))

app.get('/getForms', async (req, res) => {
  const query = "SELECT * FROM backoffice.tblformtypes";
  try{
    const queryResult = await client.query(query, []);
    res.status(200).send(queryResult.rows);
  }catch(err){
    res.status(500).send(err);
  }
});

app.get('/getForm', async (req, res) => {
  const query = "SELECT * FROM backoffice.tblformtypes WHERE id = $1";
  const formId = req.body.formId;
  try{
    const queryResult = await client.query(query, [formId]);
    res.status(200).send(queryResult.rows);
  }catch(err){
    res.status(500).send(err);
  }
});

app.post('/saveForm', async (req, res) =>{
  const query = "INSERT INTO backoffice.tblformtypes(type_name, document_fields, staff_id) VALUES ($1, $2, $3)";
  const formName = req.body.formName;
  const formFields = JSON.stringify(req.body.formFields);
  const staffId = req.body.staffId;
  try{
    await client.query(query, [formName, formFields, staffId]);
    res.status(200).send("Ok");
  }catch(err){
    res.status(500).send(err);
  }
});

app.post('/updateForm', async (req, res) =>{
  const query = "UPDATE backoffice.tblformtypes SET type_name = $2, document_fields = $3, staff_id = $4 WHERE id = $1;";
  const id = req.body.id;
  const formName = req.body.formName;
  const formFields = JSON.stringify(req.body.formFields);
  const staffId = req.body.staffId;
  try{
    await client.query(query, [id, formName, formFields, staffId]);
    res.status(200).send("Ok");
  }catch(err){
    res.status(500).send(err);
  }
});

app.post('/deleteForm', async (req, res) =>{
  const query = "DELETE FROM backoffice.tblformtypes WHERE id = $1;";
  const id = req.body.id;
  try{
    await client.query(query, [id]);
    res.status(200).send("Ok");
  }catch(err){
    res.status(500).send(err);
  }
});

app.get('/getRequests', async (req, res) => {
  const query = "SELECT request_data, ts, id, request_number, person_id FROM backoffice.tblformrequest WHERE type_id = $1";
  const typeId = req.body.id;
  try{
    const queryResult = await client.query(query, [typeId]);
    res.status(200).send(queryResult.rows);
  }catch(err){
    res.status(500).send(err);
  }
});

app.post('/saveRequest',async (req, res) =>{
  const query = "INSERT INTO backoffice.tblformrequest(type_id, request_data, ts, person_id) VALUES($1, $2, now(), $3) RETURNING request_number";
  const typeFormId = req.body.id;
  const formData = JSON.parse(req.body.data);
  const personId = req.body.personId;
  try{
    await client.query(query, [typeFormId, formData, personId]);
    res.status(200).send("Ok");
  }catch(err){
    res.status(500).send(err);
  }
});

app.post('/deleteRequest',async (req, res) =>{
  const query = "DELETE FROM backoffice.tblformrequest WHERE type_id = $1;";
  const id = req.body.id;
  try{
    await client.query(query, [id]);
    res.status(200).send("Ok");
  }catch(err){
    res.status(500).send(err);
  }
});

app.get('/getStaff', async (req, res) => {
  const query = "SELECT * FROM staff.tblperson";
  try{
    const queryResult = await client.query(query, []);
    res.status(200).send(queryResult.rows);
  }catch(err){
    res.status(500).send(err);
  }
});

// app.post('/getStaffById', async (req, res) => {
//   staffId = req.body.staffId
//   res.status(200).send(await ut.getStaffById(staffId));
// })

app.get('/getStatuses', async (req, res) => {
  const query = "SELECT * FROM backoffice.statuses";
  try{
    const queryResult = await client.query(query, []);
    res.status(200).send(queryResult.rows);
  }catch(err){
    res.status(500).send(err);
  }
});

app.get('/getCategories', async (req, res) => {
  const query = "SELECT * FROM backoffice.categories";
  try{
    const queryResult = await client.query(query, []);
    res.status(200).send(queryResult.rows);
  }catch(err){
    res.status(500).send(err);
  }
});

app.get('/getPriorities', async (req, res) => {
  const query = "SELECT * FROM backoffice.priorities";
  try{
    const queryResult = await client.query(query, []);
    res.status(200).send(queryResult.rows);
  }catch(err){
    res.status(500).send(err);
  }
});

app.post('/saveAnswer', async (req, res) =>{
  const query = "INSERT INTO backoffice.tblformanswer(status_id, category_id, priority_id, change_time, answer, request_id) VALUES ($1, $2, $3, now, $5)";
  const status_id = req.body.status_id;
  const category_id = req.body.category_id;
  const priority_id = req.body.priority_id;
  const answer = req.body.answer;
  const request_id = req.body.request_id;
  try{
    const queryResult = await client.query(query, [status_id, category_id, priority_id, answer, request_id]);
    res.status(200).send(queryResult.rows);
  }catch(err){
    res.status(500).send(err);
  }
});

app.get('/getAnswerByRequestNumber', async (req, res) =>{
  const query = "SELECT status_id, category_id, priority_id, change_time, answer from backoffice.tblformanswer WHERE request_id = (SELECT id from backoffice.tblformrequest WHERE request_number = $1) ORDER BY change_time DESC";
  const requestNumber = req.body.requestNumber;
  try{
    const queryResult = await client.query(query, [requestNumber]);
    res.status(200).send(queryResult.rows);
  }catch(err){
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})