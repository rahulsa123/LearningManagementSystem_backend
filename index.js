require("express-async-errors");

const express = require("express");
const config = require("config");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/cloudConfig")();
require("./startup/prod")(app);

const port = config.get("port") || 3000;
const server = app.listen(port, () => console.log("listening on post " + port));
module.exports = server;
