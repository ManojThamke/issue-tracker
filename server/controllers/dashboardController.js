const Project = require("../models/Project");
const Ticket = require("../models/Ticket");

const getDashboardStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments({ createdBy: req.user.id });

    const openTickets = await Ticket.countDocuments({
      createdBy: req.user.id,
      status: "To Do",
    });

    const inProgressTickets = await Ticket.countDocuments({
      createdBy: req.user.id,
      status: "In Progress",
    });

    const completedTickets = await Ticket.countDocuments({
      createdBy: req.user.id,
      status: "Done",
    });

    res.json({ totalProjects, openTickets, inProgressTickets, completedTickets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard data error" });
  }
};

const getRecentIssues = async (req, res) => {
  try {
    const recentTickets = await Ticket.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("assignee", "name");
    res.json(recentTickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching recent issues" });
  }
};

module.exports = { getDashboardStats, getRecentIssues };
