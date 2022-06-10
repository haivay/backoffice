import express from 'express';
import path from 'path'
import bodyParser from 'body-parser';
import multer from 'multer';
import fse from 'fs-extra';
import fs from 'fs';
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

app.post('/getForm', async(req, res) => {
  const formId = req.body.formId;
  try {
    res.status(200).send(await ut.getForm(formId));
  } catch (error) {
    console.log(error);
  }
});

app.post('/saveForm',(req) =>{
  const formName = req.body.formName;
  const formFields = JSON.stringify(req.body.formFields);
  const staffId = req.body.staffId;
  try {
    ut.saveForm(formName, formFields, staffId);
  } catch (error) {
    console.log(error);
  } 
});

app.post('/updateForm',(req) =>{
  const id = req.body.id;
  const formName = req.body.formName;
  const formFields = JSON.stringify(req.body.formFields);
  const staffId = req.body.staffId;
  ut.updateForm(id, formName, formFields, staffId);
})

app.post('/deleteForm',(req) =>{
  const id = req.body.id;
  ut.deleteForm(id);
})

app.post('/getRequests', async(req, res) => {
  console.log(req.body)
  const typeId = req.body.id;
  try {
    res.status(200).send(await ut.getRequests(typeId));
  } catch (error) {
    console.log(error);
  }
});



app.post('/getStaff', async(req, res) => {
  res.status(200).send(await ut.getStaff());
})

app.post('/getStaffById', async(req, res) => {
  staffId = req.body.staffId
  res.status(200).send(await ut.getStaffById(staffId));
})



app.post('/saveRequest',async (req, res) =>{
  const typeFormId = req.body.id;
  const formData = JSON.parse(req.body.data);
  const personId = req.body.personId;
  res.status(200).send(await ut.saveRequest(typeFormId, formData, personId));
});

app.post('/null', (req) => {
  if (req.file != undefined) {
    let metadata = {
      file_data: {
        mime: req.file.mimetype,
        size: req.file.size,
        is_image: ut.isImageFilter(req.file.mimetype),
      },
      file_link: req.file.path,
      file_name: req.file.filename
    }
  
    if (metadata.file_data.is_image) {
      let dimensions = {
        type: ut.getType(metadata.file_data.mime),
        width: ut.getDimensions(metadata.file_link).width,
        height: ut.getDimensions(metadata.file_link).height
      }
      Object.assign(metadata.file_data, {image_data: dimensions});
    }
  
    // res.json({'metadata': metadata});
    req.file = metadata

    const typeFormId = req.body.id;
    const formData = {data: JSON.parse(req.body.data), file: req.file};
    ut.saveRequest(typeFormId, formData);
  } else {
    const typeFormId = req.body.id;
    const formData = {data: JSON.parse(req.body.data)};
    const personId = req.body.personId;
    ut.saveRequest(typeFormId, formData, personId);
  }
});

app.post('/deleteRequest',(req) =>{
  const id = req.body.id;
  ut.deleteRequest(id);
})

app.post('/getStatuses', async (req, res) => {
  res.status(200).send(await ut.getStatuses());
});

app.post('/getCategories', async (req, res) => {
  res.status(200).send(await ut.getCategories());
});

app.post('/getPriorities', async (req, res) => {
  res.status(200).send(await ut.getPriorities());
});

app.post('/saveAnswer',(req) =>{
  const status_id = req.body.status_id;
  const category_id = req.body.category_id;
  const priority_id = req.body.priority_id;
  const answer = req.body.answer;
  const request_id = req.body.request_id;
  ut.saveAnswer(status_id, category_id, priority_id, answer, request_id);
});


// app.post('/getRequestIdByRequestNumber',(req, res) =>{
//   const requestNumber = req.body.requestNumber;
//   res.status(200).send(await ut.getRequestIdByRequestNumber(requestNumber));
// });

app.post('/getAnswerByRequestNumber', async (req, res) =>{
  const requestNumber = req.body.requestNumber;
  res.status(200).send(await ut.getAnswerByRequestNumber(requestNumber));
});

app.post('/getRequestNumber', async (req, res) =>{
  const personId = req.body.personId;
  res.status(200).send(await ut.getRequestNumber(personId));
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})