const express = require('express');
const path = require('path');


const staticServer = express();
staticServer.use('/last_email', express.static(path.join(__dirname, 'last-email')));
staticServer.listen(5051, () => console.log('Static server is up'));