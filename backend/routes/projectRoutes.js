const express = require('express');
const router = express.Router();
const { getProjects, getProjectById, investInProject, getMyInvestments, createProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const {admin} = require('../middleware/adminMiddleware');
const upload = require('../config/cloudinary');


router.get('/', getProjects);
router.get('/my-investments', protect, getMyInvestments);
router.get('/:id', getProjectById);
router.post('/invest', protect, investInProject);
router.post('/', protect, admin, upload.single('image'), createProject);
router.delete('/:id', protect, admin, deleteProject);

module.exports = router;