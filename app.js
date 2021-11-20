const express = require('express');
const parser = require('body-parser');
const router = require('./routers/auth');
const app = express();

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use('/api', router);

module.exports = app;