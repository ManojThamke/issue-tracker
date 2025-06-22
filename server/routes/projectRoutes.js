const express = require('express');
const router = express.Router();
const { createProject, getProjects, updateProjectStatus, deleteProject, getProjectProgress, inviteTeamMember } = require('../controllers/projectController');
const protect = require('../middleware/authMiddleware');

// Routes
router.post('/', protect, createProject);
router.get('/', protect, getProjects);
router.put('/:id/status', protect, updateProjectStatus); 
router.delete('/:id', protect, deleteProject);
router.get("/:projectId/progress", protect, getProjectProgress);
router.post("/:id/invite", protect, inviteTeamMember);

module.exports = router;
