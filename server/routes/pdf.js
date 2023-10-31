const { authenticateUser } = require("../middlewares/authenticate.middleware");
const PDFModel = require("../models/pdf.model");
const upload = require("../utils/upload");
const path = require('path');
const pdfRouter = require("express").Router();
const PDFDocument = require('pdf-lib').PDFDocument;
const fs = require('fs');
const mongoose = require("mongoose")

pdfRouter.get("/",async(req,res)=>{
    try {
        let data = await PDFModel.find();
        res.send(data)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"error",error})
    }
})


pdfRouter.post('/upload', authenticateUser, upload.single('pdf'), async (req, res) => {
    try {
      const { originalname, path } = req.file;
      const newPDF = await PDFModel.create({
        filePath: path,
        originalName: originalname,
        userId: req.user._id, // Assuming you set req.user in your authentication middleware
      });
      res.status(201).json(newPDF);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
  });

  pdfRouter.get('/user-pdfs',authenticateUser, async (req, res) => {
    try {
      const userPDFs = await PDFModel.find({ userId: req.user._id });
      res.json(userPDFs);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

pdfRouter.get('/:pdfId',authenticateUser, async (req, res) => {
    try {
      const pdfId = req.params.pdfId;
      const pdf = await PDFModel.findById(pdfId);
  
      if (!pdf) {
        return res.status(404).send({message:'PDF not found'});
      }
  
      if (pdf.userId.toString() !== req.user._id.toString()) {
        return res.status(403).send({message:'You do not have access to this PDF'});
      }
      console.log(path)
      const filePath = path.join(__dirname, '..', pdf.filePath);
      res.sendFile(filePath);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });


pdfRouter.post('/extract-pages',authenticateUser, async (req, res) => {
    try {
      const { pdfId, pages, newPdfName } = req.body;
      if (!mongoose.isValidObjectId(pdfId)) {
        return res.status(400).json({ message: 'Invalid PDF ID' });
      }
      // Validate pages array
      if (!Array.isArray(pages) || pages.some(isNaN)) {
        return res.status(400).send('Invalid pages array');
      }
 
      // Validate new PDF name
      if (typeof newPdfName !== 'string' || newPdfName.trim() === '') {
        return res.status(400).send('Invalid new PDF name');
      }
  
      const sanitizedNewPdfName = newPdfName.trim().replace(/[^a-zA-Z0-9-_]/g, '');
      if (sanitizedNewPdfName === '') {
        return res.status(400).send('Invalid new PDF name');
      }
  
      // Find the PDF in the database
      const pdf = await PDFModel.findById(pdfId);
      if (!pdf) return res.status(404).send('PDF not found');
      if (pdf.userId.toString() !== req.user._id.toString()) {
        return res.status(403).send('You do not have access to this PDF');
      }
  
      // Read the PDF from disk (or wherever it’s stored)
      const existingPdfBytes = fs.readFileSync(`./${pdf.filePath}`);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
      // Validate page numbers
      if (pages.some(page => page < 1 || page > pdfDoc.getPageCount())) {
        return res.status(400).send('Invalid page number');
      }
  
      // Create a new PDF and add the specified pages to it
      const newPdfDoc = await PDFDocument.create();
      const copiedPages = await newPdfDoc.copyPages(pdfDoc, pages.map(p => p - 1));
      copiedPages.forEach(page => newPdfDoc.addPage(page));

 
      // Save the new PDF to disk
      const newPdfBytes = await newPdfDoc.save();
      const newPdfFilename = `${sanitizedNewPdfName}-${Date.now()}.pdf`;
      const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const newFilePath = uniquePrefix + '-' + newPdfFilename;
      fs.writeFileSync(`./uploads/${newFilePath }`, newPdfBytes);
  
      // Save the new PDF's metadata to MongoDB
     
      const newPdf = new PDFModel({
        filePath:`./uploads/${newFilePath }`,
        originalName:newPdfFilename,
        userId: req.user._id,
      });
      await newPdf.save();
  
      res.send({ message: 'PDF extracted and saved successfully', newPdfId: newPdf._id });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });


pdfRouter.get('/download/:pdfId', authenticateUser, async (req, res) => {
    try {
      // Extract the PDF ID from the request parameters
      const { pdfId } = req.params;
  
      // Validate the PDF ID
      if (!mongoose.isValidObjectId(pdfId)) {
        return res.status(400).json({ message: 'Invalid PDF ID' });
      }
  
      // Find the PDF in the database
      const pdf = await PDFModel.findById(pdfId);
  
      // Check if the PDF exists and belongs to the authenticated user
      if (!pdf || pdf.userId.toString() !== req.user._id.toString()) {
        return res.status(404).json({ message: 'PDF not found or access denied' });
      }
  
      // Set the headers for file download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${pdf.originalName}`);
  
      // Create a read stream for the PDF file and pipe it to the response
      const fileStream = fs.createReadStream(pdf.filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

  pdfRouter.delete('/delete/:pdfId', authenticateUser, async (req, res) => {
    try {
      const pdfId = req.params.pdfId;
      const userId = req.user._id;

      // Find the PDF document in the database
      const pdf = await PDFModel.findById(pdfId);

      // Check if the PDF document was found
      if (!pdf) {
        return res.status(404).json({ message: 'PDF not found' });
      }
      
      // Check if PDF belongs to the authenticated user
      if (pdf.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      // Check if the PDF file exists on disk
      if (!fs.existsSync(pdf.filePath)) {
        // Optionally, you could delete the MongoDB document if the file does not exist
        await PDFModel.findByIdAndDelete(pdfId);
        return res.status(404).json({ message: 'PDF file not found on disk, but removed from database' });
      }

      // Delete PDF file from disk
      fs.unlink(pdf.filePath, async(err) => {
        if (err) {
          console.error('Failed to delete PDF file from disk:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
  
        // Delete PDF document from MongoDB
        await PDFModel.findByIdAndDelete(pdfId);
        res.json({ message: "Document deleted successfully.." });
      });
    } catch (error) {
      console.error('Failed to delete PDF:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

pdfRouter.post("/rearrange-pdf/:pdfId", authenticateUser, async (req, res) => {
    try {
      const pdfId = req.params.pdfId;
      const pdfInfo = await PDFModel.findById(pdfId);
      if (!pdfInfo) return res.status(404).json({ message: "PDF not found" });
  
      const pdfPath = pdfInfo.filePath;
      if (!fs.existsSync(pdfPath)) {
        return res.status(404).json({ message: "PDF file not found on server" });
      }
  
      const existingPdfBytes = fs.readFileSync(pdfPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
      const pageOrder = req.body.pageOrder;
      const numPages = pdfDoc.getPages().length;
      console.log(numPages)
      const isValidOrder = pageOrder.every(num => num > 0 && num <= numPages);
      if (!isValidOrder) {
        return res.status(400).json({ message: "Invalid page order" });
      }
  
      const rearrangedPdf = await PDFDocument.create();
      for (const pageIndex of pageOrder) {
        const [page] = await rearrangedPdf.copyPages(pdfDoc, [pageIndex - 1]);
        rearrangedPdf.addPage(page);
      }
  
      const rearrangedPdfBytes = await rearrangedPdf.save();
      fs.writeFileSync(pdfPath, rearrangedPdfBytes);
  
      await PDFModel.findByIdAndUpdate(pdfId, { updatedAt: new Date() });
  
      res.json({ message: "PDF rearranged successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });

module.exports={pdfRouter}