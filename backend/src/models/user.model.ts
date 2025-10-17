import mongoose, { Schema, Document } from "mongoose";

export interface Profile extends Document {
  name: string;
  timezone: string;
  created_at: Date;
  updated_at: Date;
}

const profileSchema: Schema<Profile> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  timezone: {
    type: String,
    required: true,
    default: "UTC",
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

// Middleware to update the updated_at field before saving
profileSchema.pre<Profile>("save", function (next) {
  this.updated_at = new Date();
  next();
});

const profileModel =
  mongoose.models.Profile || mongoose.model<Profile>("Profile", profileSchema);

export default profileModel;
