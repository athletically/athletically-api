const fs = require('fs');
const os = require('os');
const path = require('path');
const adminController = require('../controllers/adminController');
const appConfig = require("../../config/appConfig");
const auth = require('../middlewares/auth');
const validator = require('../middlewares/validator');
const multer = require('multer');

// Configure multer for handling form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const storagLarge = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, os.tmpdir()); // Store files in the system's temporary directory
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now().toString()}${path.extname(file.originalname)}`);
    }
});

const uploadLarge = multer({ storage: storagLarge });

module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}/admin`;
    app.get(`${baseUrl}/getAllUsers`, adminController.getAllUsers);
};