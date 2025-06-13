const express = require("express");
const router = express.Router();
const db = require("../config/database");
const upload = require("../middleware/upload");
const fs = require("fs").promises;

// Product management
// get all products with detailed info
