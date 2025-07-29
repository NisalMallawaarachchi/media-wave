import express from 'express';
import multer from 'multer';
import { uploadFiles, deleteFile, getMediaList, getMediaDetails } from '../controllers/upload.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.array('files'), uploadFiles);
router.get('/all', getMediaList);
router.get('/:id', getMediaDetails); // GET /api/media/:id
router.delete('/delete/:public_id', deleteFile);

export default router;