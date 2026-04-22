import { Router } from "express";
import { Event } from "../models";
import asyncHandler from "../middleware/asyncHandler";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";
import { localizeFields } from "../utils/localization";

const router = Router();

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get("/", asyncHandler(async (req, res) => {
    const { featured, upcoming } = req.query;
    const filter: any = { deletedAt: null };

    if (featured === 'true') filter.featured = true;
    if (upcoming === 'true') filter.startDate = { $gte: new Date() };

    const events = await Event.find(filter).sort({ startDate: 1 });
    res.json({ success: true, data: events });
}));

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
router.get("/:id", asyncHandler(async (req, res) => {
    const event = await Event.findOne({ _id: req.params.id, deletedAt: null });
    if (!event) {
        res.status(404).json({ success: false, message: "Event not found" });
        return;
    }
    res.json({ success: true, data: event });
}));

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin
router.post("/", protect, authorize("admin"), asyncHandler(async (req, res) => {
    const localizedBody = localizeFields(req.body, ['title', 'description', 'location', 'organizer']);
    const event = await Event.create(localizedBody);
    res.status(201).json({ success: true, data: event });
}));

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
router.put("/:id", protect, authorize("admin"), asyncHandler(async (req, res) => {
    const localizedBody = localizeFields(req.body, ['title', 'description', 'location', 'organizer']);
    const event = await Event.findByIdAndUpdate(req.params.id, localizedBody, {
        new: true,
        runValidators: true,
    });
    if (!event) {
        res.status(404).json({ success: false, message: "Event not found" });
        return;
    }
    res.json({ success: true, data: event });
}));

// @desc    Delete event (soft delete)
// @route   DELETE /api/events/:id
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), asyncHandler(async (req, res) => {
    const event = await Event.findByIdAndUpdate(req.params.id, { deletedAt: new Date() }, { new: true });
    if (!event) {
        res.status(404).json({ success: false, message: "Event not found" });
        return;
    }
    res.json({ success: true, message: "Event deleted" });
}));

export default router;
