const express = require('express');
const app = express();
const path = __dirname;

const port = 8080;

/* app.use('/aplicacao1', express.static(path+'/src/aplicacao1'));
app.use('/aplicacao2', express.static(path+'/src/aplicacao2')); */
app.use('/', express.static(path+'/src/'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));