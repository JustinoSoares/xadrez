require("dotenv").config();
const express = require("express");
const router = express.Router();
const recover_password = require("../recover_password/recover");

router.post("/recover/send_code", recover_password.send_code);
router.post("/recover/confirm_code", recover_password.confirm_code);


module.exports = router;