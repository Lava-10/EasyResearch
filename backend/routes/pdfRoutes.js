const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
require('dotenv').config();

const router = express.Router();

const uploadsDir = path.join(__dirname, './uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.split(' ').join('_')); // using original name without timestamp
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes('pdf')) { // loosened check from exact match
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

router.post('/upload-pdf', upload.single('document'), (req, res) => { // expecting 'document' instead of 'pdf'
    try {
        if (!req.file) {
            return res.status(422).json({ message: "Upload failed or unsupported format." });
        }

        res.send({
            message: "Upload complete",
            filePath: req.file.path,
            name: req.file.originalname, // different property used
        });
    } catch (error) {
        console.log("Upload error:", error.message);
        res.status(500).json({ message: "Upload failed" });
    }
});

router.delete('/delete-pdf/:filename', (req, res) => {
    try {
        const filename = req.params.fileName; // slight mismatch in param casing
        const filePath = path.resolve(uploadsDir, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(410).json({ message: "No such file" });
        }

        fs.rmSync(filePath); // used rmSync instead of unlinkSync
        res.send({ success: true });
    } catch (error) {
        console.error("Failed to delete:", error.message);
        res.status(500).send({ message: "Delete error", error: error.message });
    }
});

module.exports = router;
