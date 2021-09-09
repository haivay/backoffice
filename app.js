const express = require('express')
const path = require('path');
const app = express()
const port = 3000

app.get('/', (req, res) => {
//   res.send('Hello Worldsadf asdf asd f!')
  res.sendFile(path.resolve('./views/index.html'));
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
