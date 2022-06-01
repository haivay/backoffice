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

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    let random = Math.floor(1000000000 + Math.random() * (9999999999 + 1 - 1000000000)).toString();
    let path = `./uploads/${random}`;
    fse.mkdirSync(path)
    cb( null, path )
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.split('.')[0] + '-' + (new Date()).toLocaleDateString('ru-RU') + `.${file.originalname.split('.')[1]}`)
  }
})

const upload = multer({
  storage: storageConfig
});
app.use(upload.single('file'))

const __dirname = path.resolve();

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

app.post('/getData', async(req, res) => {
  const typeId = req.body.id;
  res.status(200).send(await ut.getData(typeId));
});

app.post('/getForm', async(req, res) => {
  const formId = req.body.formId;
  res.status(200).send(await ut.getForm(formId));
})

app.post('/getStaff', async(req, res) => {
  res.status(200).send(await ut.getStaff());
})

app.post('/getStaffById', async(req, res) => {
  staffId = req.body.staffId
  res.status(200).send(await ut.getStaffById(staffId));
})

app.post('/saveForm',(req) =>{
  const formName = req.body.formName;
  const formFields = JSON.stringify(req.body.formFields);
  const staffId = req.body.staffId;
  ut.saveForm(formName, formFields, staffId);
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

// app.post('/sendFile', (req, res) => {
//   let metadata = {
//     file_data: {
//       mime: req.file.mimetype,
//       size: req.file.size,
//       is_image: ut.isImageFilter(req.file.mimetype),
//     },
//     file_link: req.file.path,
//     file_name: req.file.filename
//   }

//   if (metadata.file_data.is_image) {
//     let dimensions = {
//       type: ut.getType(metadata.file_data.mime),
//       width: ut.getDimensions(metadata.file_link).width,
//       height: ut.getDimensions(metadata.file_link).height
//     }
//     Object.assign(metadata.file_data, {image_data: dimensions});
//   }

//   res.json({'metadata': metadata});
//   req.file = metadata
//   const typeFormId = req.body.id
//   const formData = {file: req.file, data: req.body.data}
//   ut.sendData(typeFormId, formData)
// })

app.post('/sendData', (req) => {
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
    ut.sendData(typeFormId, formData);
  } else {
    const typeFormId = req.body.id;
    const formData = {data: JSON.parse(req.body.data)};
    const personId = req.body.personId;
    ut.sendData(typeFormId, formData, personId);
  }
});

app.post('/download', (req, res) => {
  console.log('не работает')
  // console.log(req.body);

  // const path = req.body.file_link
  // console.log(`${__dirname}\\${path}`)
  // const file = fs.createReadStream(`${__dirname}\\${path}`)
  // const filename = (new Date()).toLocaleDateString('ru-RU') + req.body.file_name
  // res.setHeader('Content-Disposition', 'attachment: filename="' + filename + '"')
  // file.pipe(res)

  // var path = req.body.file_link
  // // console.log(`${__dirname}\\${path}`)
  // res.setHeader('Content-Disposition')
  // res.download(`${__dirname}\\${path}`, (err) => {
  //   if (err) {
  //     res.status(500).send({
  //       message: 'ошибка при скачивании: ' + err
  //     })
  //   } else {
  //     console.log('загрузка прошла успешно')
  //   }
  // });  


  // const filename = req.body.filename;
  // const dirname = path.resolve();
  // const fullfilepath = path.join(dirname, 'uploads/' + filename);
  // res.sendFile(fullfilepath);
  // res.download(fullfilepath);
  // console.log(res)
});

app.post('/deleteData',(req) =>{
  const id = req.body.id;
  ut.deleteData(id);
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})