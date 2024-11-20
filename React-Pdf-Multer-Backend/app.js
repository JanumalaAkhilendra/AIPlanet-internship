const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use("/files", express.static("files"));

mongoose.set('strictQuery', false);
//mongodb connection----------------------------------------------
const mongoUrl = process.env.MongoUrl;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));
//multer------------------------------------------------------------
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

require("./pdfDetails");
const PdfSchema = mongoose.model("PdfDetails");
const upload = multer({ storage: storage });
const fs = require('fs');
const pdfParse = require("pdf-parse");

app.post("/upload-files", upload.single("file"), async (req, res) => {
  try {
    console.log(req.file);
    
    if (!req.file) {
      return res.status(400).json({ status: "error", message: "No file uploaded" });
    }
    
    const title = req.body.title;
    const fileName = req.file.filename;
    
    // Check if file exists
    const filePath = `./files/${fileName}`;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        status: "error", 
        message: "File not found in the specified path" 
      });
    }
    
    // Read and parse PDF
    const fileBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(fileBuffer);
    
    // Create database entry
    const pdfDoc = await PdfSchema.create({
      title: title,
      pdf: fileName,
      text: pdfData.text
    });
    
    res.status(200).json({ 
      status: "ok",
      message: "PDF successfully uploaded and parsed",
      pdfId: pdfDoc._id
    });
    
  } catch (error) {
    console.error("PDF Upload Error:", error);
    res.status(500).json({ 
      status: "error", 
      message: error.message || "Error processing PDF file" 
    });
  }
});

app.get("/get-files", async (req, res) => {
  try {
    PdfSchema.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) { }
});

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GroqApi, // Replace with your actual Groq API key
});

app.post("/ask-question", async (req, res) => {
  const { pdfId, question } = req.body;

  try {
    const pdf = await PdfSchema.findById(pdfId);

    if (!pdf) {
      return res.status(404).json({ error: "PDF not found" });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that answers questions based on the provided document content."
        },
        {
          role: "user",
          content: `The document content is:\n${pdf.text}\n\nAnswer this question: ${question}`
        }
      ],
      model: "mixtral-8x7b-32768", // Groq's recommended model
      temperature: 0.7,
      max_tokens: 300,
    });

    res.json({ answer: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ error: error.message });
  }
});


//apis----------------------------------------------------------------
app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});

app.listen(5000, () => {
  console.log("Server Started");
});
