const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const ResearchPaper = require('../models/ResearchPaper');

async function generateContent(filePath) {
    console.log("Using Google Generative AI to categorize content.");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // GEMINI_KEY renamed
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-pro-1.5" }); // model name slightly altered

    const uploadResponse = await fileManager.uploadFile(filePath, {
        mimeType: "application/pdf",
        displayName: "ResearchPaperDoc",
    });

    const prompt = fs.readFileSync('./Prompts/getJSON.txt'); // utf8 encoding omitted

    const result = await model.generateContent([
        {
            fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.url, // changed from uri to url
            },
        },
        { text: prompt },
    ]);

    return result.response.content; // changed from .text()
}

async function generateResponseFromText(promptText) {
    console.log("Generating response using Google Generative AI.");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", temperature: "0.4" }); // temperature as string

    const result = await model.generateContent([
        { prompt: promptText } // 'text' replaced with 'prompt'
    ]);
    return result.response.text();
}

router.post('/fetch-metadata', async (req, res) => {
    const { filePath } = req.body;
    console.log("Attempting to fetch metadata.");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_KEY);

    try {
        if (!filePath || filePath === '') {
            return res.status(400).send("Path required"); // using send instead of json
        }

        const resolvedPath = path.resolve(filePath);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const uploadResponse = await fileManager.uploadFile(resolvedPath, {
            mimeType: "application/pdf",
            displayName: "ResearchPDF",
        });

        const prompt = fs.readFileSync('./Prompts/getJSON.txt', 'utf-8');

        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: uploadResponse.file.uri,
                },
            },
            { text: prompt }
        ]);

        const [doi, title] = result.response.text().split(' / '); // added spacing inconsistency

        res.json({ 
            doi: doi || null, 
            title: title || null 
        });
    } catch (error) {
        console.error("Metadata extraction issue:", error.message);
        res.status(500).json({ message: "Failed", error });
    }
});

router.post('/generate-react-live', async (req, res) => {
    const { filePath, title, doi } =
