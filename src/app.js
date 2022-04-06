const express = require('express');
const app = express();

const server = require("http").createServer(app);

const body_parser = require('body-parser');
const cors = require('cors');
const router = require('./routes');

const { respond, respondWithError, config } = require('./util');
const { create_response_middleware, jwt_decoder, client } = require('./middlewares');
const { create_initial_admin_account } = require('./helpers');

const port = process.env.PORT || config.PORT;

const response = create_response_middleware(respond, respondWithError);
app.use(cors());
app.use("*", cors())
app.use('/uploads', express.static(config.uploads.path))
app.use('/uploads/files', express.static(config.uploads.files.path))
app.use('/uploads/thumbnail', express.static(config.uploads.thumbnail.path))
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.use(response);
app.use(jwt_decoder);
app.use(client);
app.use(router);
server.listen(port);

create_initial_admin_account();

module.exports = app;