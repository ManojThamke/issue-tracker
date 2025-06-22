const Ticket = require("../models/Ticket");

// Create Ticket
const createTicket = async (req, res) => {
  const { title, description, priority, status, assignee, projectId } = req.body;

  try {
    const ticket = await Ticket.create({
      title,
      description,
      priority,
      status,
      assignee,
      projectId,
      createdBy: req.user.id,
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating ticket" });
  }
};

// Get All Tickets for a Project
const getTicketsByProject = async (req, res) => {
  try {
    const tickets = await Ticket.find({ projectId: req.params.projectId }).populate("assignee", "name email");
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching tickets" });
  }
};

// Update Ticket
const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.title = req.body.title || ticket.title;
    ticket.description = req.body.description || ticket.description;
    ticket.priority = req.body.priority || ticket.priority;
    ticket.status = req.body.status || ticket.status;
    ticket.assignee = req.body.assignee || ticket.assignee;

    const updatedTicket = await ticket.save();
    res.json(updatedTicket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating ticket" });
  }
};

// Delete Ticket
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await ticket.deleteOne();
    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while deleting ticket" });
  }
};

// Assigned Ticket
const getAssignedTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignee: req.user.id })
      .populate("projectId", "title")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: "Server error fetching assigned tickets" });
  }
};

const searchTickets = async (req, res) => {
  try {
    const { search = "", status = "", priority = "" } = req.query;

    const query = {
      createdBy: req.user.id,
    };

    if (search) {
      query.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to search tickets" });
  }
};


module.exports = {
  createTicket,
  getTicketsByProject,
  updateTicket,
  deleteTicket,
  getAssignedTickets,
  searchTickets,
};
