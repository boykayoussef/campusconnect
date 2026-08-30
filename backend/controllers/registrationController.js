import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

export async function create(req, res, next) {
  try {
    const { event, eventId, note = '' } = req.body;
    const targetEvent = event || eventId;
    if (!targetEvent) return res.status(400).json({ success: false, message: 'event is required' });
    const e = await Event.findById(targetEvent);
    if (!e) return res.status(404).json({ success: false, message: 'Event not found' });
    if (e.status === 'closed' || new Date(e.eventDate) <= new Date()) return res.status(400).json({ success: false, message: 'Event is unavailable' });

    const existing = await Registration.findOne({ user: req.user.id, event: targetEvent });
    if (existing && existing.status !== 'cancelled') return res.status(409).json({ success: false, message: 'You are already registered for this event' });

    const count = await Registration.countDocuments({ event: targetEvent, status: { $ne: 'cancelled' } });
    if (count >= e.totalSlots) return res.status(400).json({ success: false, message: 'Event is full' });

    let r;
    if (existing) {
      existing.status = 'pending';
      existing.note = note;
      r = await existing.save();
    } else {
      r = await Registration.create({ user: req.user.id, event: targetEvent, note });
    }
    await r.populate('event');
    res.status(201).json({ success: true, registration: r });
  } catch (error) {
    next(error);
  }
}

export async function mine(req, res, next) {
  try {
    res.json({ success: true, registrations: await Registration.find({ user: req.user.id }).populate('event').sort({ registeredAt: -1 }) });
  } catch (error) { next(error); }
}

export async function status(req, res, next) {
  try {
    const registration = await Registration.findOne({ user: req.user.id, event: req.params.eventId }).populate('event');
    res.json({ success: true, registered: !!registration && registration.status !== 'cancelled', registration });
  } catch (error) { next(error); }
}

export async function eventRegistrants(req, res, next) {
  try {
    const e = await Event.findById(req.params.id);
    if (!e) return res.status(404).json({ success: false, message: 'Event not found' });
    if (req.user.role !== 'admin' && e.createdBy.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'You do not own this event' });
    res.json({ success: true, registrations: await Registration.find({ event: e._id }).populate('user', 'name email profilePicture') });
  } catch (error) { next(error); }
}

export async function updateStatus(req, res, next) {
  try {
    const r = await Registration.findById(req.params.id);
    if (!r) return res.status(404).json({ success: false, message: 'Registration not found' });
    if (!['pending', 'confirmed', 'cancelled'].includes(req.body.status)) return res.status(400).json({ success: false, message: 'Invalid registration status' });

    if (req.user.role === 'admin') {
      r.status = req.body.status;
    } else if (req.user.role === 'clubLeader') {
      const event = await Event.findById(r.event).select('createdBy');
      if (!event || event.createdBy.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Only the event owner can change this registration' });
      r.status = req.body.status;
    } else if (r.user.toString() === req.user.id) {
      r.status = req.body.status;
    } else {
      return res.status(403).json({ success: false, message: 'Only the owner, event leader, or admin can change this registration' });
    }

    await r.save();
    await r.populate('event');
    res.json({ success: true, registration: r });
  } catch (error) { next(error); }
}

export async function remove(req, res, next) {
  try {
    const r = await Registration.findById(req.params.id);
    if (!r) return res.status(404).json({ success: false, message: 'Registration not found' });
    if (req.user.role !== 'admin' && r.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Only the student or admin can cancel' });
    r.status = 'cancelled';
    await r.save();
    res.json({ success: true, registration: r });
  } catch (error) { next(error); }
}
