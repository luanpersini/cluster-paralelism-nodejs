const express = require('express');
const app = express();
const testFunction = require('./test-function')

const port = process.env.PORT || 5051;
const server = app.listen(port, () => { console.log(`Listening on port ${port}...`); });

app.get('/', (req, res, next) => {
  testFunction()
  res.send('Hi there! Process completed.');
})

