const express = require("express");
const router = express.Router();
const { createTicket, getTicketsByProject, updateTicket, deleteTicket, getAssignedTickets, searchTickets } = require("../controllers/ticketController");
const protect = require("../middleware/authMiddleware");

// Routes → all protected by JWT
router.post("/", protect, createTicket);
router.get("/:projectId", protect, getTicketsByProject);
router.put("/:id", protect, updateTicket);
router.delete("/:id", protect, deleteTicket);
router.get("/assigned/me", protect, getAssignedTickets);
router.get("/search/all", protect, searchTickets);

module.exports = router;
