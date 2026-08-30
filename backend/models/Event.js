import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  club: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, required: true },
  requirements: { type: [String], default: [] },
  location: { type: String, required: true, maxlength: 255 },
  eventDate: { type: Date, required: true },
  type: { type: String, enum: ['workshop', 'social', 'competition', 'volunteering', 'other'], required: true },
  category: { type: String, required: true },
  totalSlots: { type: Number, min: 1, default: 20 },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

eventSchema.index({ eventDate: 1 });
eventSchema.index({ category: 1 });

eventSchema.virtual('remainingSlots').get(function () { return this.totalSlots; });
eventSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Event', eventSchema);
