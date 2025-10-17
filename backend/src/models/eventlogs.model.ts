import mongoose, { Schema, Document, Types } from "mongoose";

export interface EventLog extends Document {
  eventId: Types.ObjectId;
  updatedBy: Types.ObjectId;
  before: Record<string, any>;
  after: Record<string, any>;
  timestampUtc: Date;
  created_at: Date;
  updated_at: Date;
}

// EventLog model schema
const eventLogSchema: Schema<EventLog> = new mongoose.Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  before: {
    type: Schema.Types.Mixed,
    required: true,
  },
  after: {
    type: Schema.Types.Mixed,
    required: true,
  },
  timestampUtc: {
    type: Date,
    default: () => new Date(),
    required: true,
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

eventLogSchema.pre<EventLog>("save", function (next) {
  this.updated_at = new Date();
  next();
});

// eventLog model export
const eventLogModel =
  mongoose.models.EventLog ||
  mongoose.model<EventLog>("EventLog", eventLogSchema);

export default eventLogModel;
