const Project = require('../models/Project');
const Ticket = require('../models/Ticket');
const User = require('../models/User');

// Create a new Project
const createProject = async (req, res) => {
  const { title, description, status = "Not Started" } = req.body;

  try {
    const project = await Project.create({
      title,
      description,
      status,
      createdBy: req.user.id,
      teamMembers: [req.user.id],
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating project' });
  }
};

// Get all projects for the logged-in user
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id })
      .populate("teamMembers", "name email");
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching projects" });
  }
};

// Update project status
const updateProjectStatus = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: "Not authorized to update this project" });
    }

    project.status = req.body.status || project.status;
    const updatedProject = await project.save();

    res.json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating project" });
  }
};

// Delete a project by ID
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this project" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while deleting project" });
  }
};

// GET → Progress of a Project
const getProjectProgress = async (req, res) => {
  try {
    const { projectId } = req.params;

    const totalTickets = await Ticket.countDocuments({ projectId });
    const completedTickets = await Ticket.countDocuments({ projectId, status: "Done" });

    const progress = totalTickets === 0 ? 0 : Math.round((completedTickets / totalTickets) * 100);

    res.json({ totalTickets, completedTickets, progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error calculating project progress" });
  }
};

// invite team member
const inviteTeamMember = async (req, res) => {
  try {
    const { email } = req.body;
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to invite to this project" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fix for ObjectId comparison
    if (project.teamMembers.some((member) => member.equals(user._id))) {
      return res.status(400).json({ message: "User already in team" });
    }

    project.teamMembers.push(user._id);
    await project.save();

    res.json({ message: "User invited successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error inviting user to project" });
  }
};




module.exports = {
  createProject,
  getProjects,
  updateProjectStatus,
  deleteProject,
  getProjectProgress,
  inviteTeamMember,
};
