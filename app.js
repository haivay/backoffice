import express from 'express';
import path from 'path'
import bodyParser from 'body-parser';
import multer from 'multer';
import imageSize from 'image-size';
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

// app.post('/data/getForms', async (req, res) => {
//   res.status(200).send(await ut.getForms());
// });

app.post('/getData', async(req, res) => {
  const typeId = req.body.id;
  res.status(200).send(await ut.getData(typeId));
});

app.post('/saveForm',(req) =>{
  const formName = req.body.formName;
  const formFields = JSON.stringify(req.body.formFields);
  ut.saveForm(formName, formFields);
});

const isImageFilter = function(mimetype) {
  return (mimetype.split('/')[0] === 'image') ? true : false
}

const getType = function(mimetype) {
  let type = mimetype.split('/')[1];
  if (type === 'jpeg') type = 'jpg'
  return type
}

const getDimensions = function(filelink) {
  let dimensions = imageSize(filelink)
  return dimensions
}

app.post('/sendFile', (req, res) => {
  let metadata = {
    file_data: {
      mime: req.file.mimetype,
      size: req.file.size,
      is_image: isImageFilter(req.file.mimetype),
    },
    file_link: req.file.path,
    file_name: req.file.filename
  }

  if (metadata.file_data.is_image) {
    let dimensions = {
      type: getType(metadata.file_data.mime),
      width: getDimensions(metadata.file_link).width,
      height: getDimensions(metadata.file_link).height
    }
    Object.assign(metadata.file_data, dimensions);
  }

  res.json({'metadata': metadata});
  req.file = metadata
  const typeFormId = req.body.id
  const formData = {file: req.file, data: req.body.data}
  ut.sendData(typeFormId, formData)
})

app.post('/sendData', (req) => {
  const typeFormId = req.body.id;
  const formData = { data: req.body.data };
  ut.sendData(typeFormId, formData);
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

app.post('/deleteData',(req) =>{
  const id = req.body.id;
  ut.deleteData(id);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})