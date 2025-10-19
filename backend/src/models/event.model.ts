import mongoose, { Schema, Document, Types } from "mongoose";

export interface Event extends Document {
  title: string;
  description?: string;
  profiles: Types.ObjectId[];
  eventTimezone: string;
  startUtc: Date;
  endUtc: Date;
  createdBy?: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

// Event model schema
const eventSchema: Schema<Event> = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  profiles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
  ],
  eventTimezone: {
    type: String,
    required: true,
    default: "UTC",
  },
  startUtc: {
    type: Date,
    required: true,
  },
  endUtc: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
  },
  created_at: {
    type: Date,
    default: () => new Date(),
    required: true,
  },
  updated_at: {
    type: Date,
    default: () => new Date(),
    required: true,
  },
});

eventSchema.pre<Event>("save", function (next) {
  this.updated_at = new Date();
  next();
});

// event model export
export const eventModel =
  mongoose.models.Event || mongoose.model<Event>("Event", eventSchema);

export default eventModel;
