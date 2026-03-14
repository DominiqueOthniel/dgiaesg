import mongoose from "mongoose";

const agendaItemSchema = new mongoose.Schema({
  time: { type: String, required: true },
  label: {
    fr: { type: String, required: true },
    en: { type: String, required: true }
  },
  description: {
    fr: { type: String },
    en: { type: String }
  }
});

const eventSchema = new mongoose.Schema(
  {
    title: {
      fr: { type: String, required: true },
      en: { type: String, required: true }
    },
    description: {
      fr: { type: String, required: true },
      en: { type: String, required: true }
    },
    type: {
      type: String,
      enum: ["workshop", "conference", "training", "networking", "certification", "other"],
      default: "other"
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: {
      fr: { type: String, required: true },
      en: { type: String, required: true }
    },
    organizer: {
      fr: { type: String },
      en: { type: String }
    },
    imageUrl: { type: String },
    registrationUrl: { type: String },
    agenda: [agendaItemSchema],
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  },
  {
    timestamps: true
  }
);

// Search index
eventSchema.index({ "title.fr": "text", "title.en": "text", "description.fr": "text", "description.en": "text" });

const Event = mongoose.model("Event", eventSchema);
export default Event;
