// routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import { uploadFiles, deleteFile } from '../controllers/upload.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.array('files'), uploadFiles);
router.delete('/delete/:public_id', deleteFile);

export default router;
