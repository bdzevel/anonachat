"use strict";

var router = require("express").Router();

var GET = require("./handlers/get");
var PUT = require("./handlers/put");
var POST = require("./handlers/post");
var DELETE = require("./handlers/delete");

router.get("/", GET);
router.put("/", PUT);
router.post("/:id", POST);
router.delete("/:id", DELETE);

module.exports = router;