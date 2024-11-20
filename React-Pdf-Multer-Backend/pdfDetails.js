const mongoose = require("mongoose");

const PdfDetailsSchema = new mongoose.Schema(
  { 
    id:Number,
    pdf: String,
    title: String,
    text: String,
  },
  { collection: "PdfDetails" }
);

mongoose.model("PdfDetails", PdfDetailsSchema);
