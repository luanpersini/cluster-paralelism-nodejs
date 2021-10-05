const os = require('os');
const cluster = require('cluster');
const testFunction = require('./test-function')

if (cluster.isMaster) {
  const n_cpus = os.cpus().length;
  console.log(`Forking ${n_cpus} CPUs`);
  console.log(`Primary ${process.pid} is running`);
  for (let i = 0; i < n_cpus; i++) { cluster.fork(); }
} else {

  const express = require('express');
  const app = express();

  const port = process.env.PORT || 5051;
  const pid = process.pid;
  const server = app.listen(port, () => { console.log(`Server process ${pid} is listening...`); });
  
  // e7 = 7 zeros
  app.get('/', (req, res, next) => {
    testFunction()  
    // for (let i = 0; i < 3e7; i++){
    //   for (let j = 0; j < 5; j++){}
    // }  
    res.send('Hi there! Process completed.');
  });
}