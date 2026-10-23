import mongoose, { Schema } from "mongoose";

const ProfileSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    name: String,
    headline: String,
    intro: String,
    bio: String,
    headshot: String,
    headshotAlt: String,
    location: String,
    email: String,
    resumeUrl: String,
    availability: {
      open: { type: Boolean, default: false },
      note: String,
    },
    skills: [String],
    socials: {
      linkedin: String,
      dribble: String,
      behance: String,
      x: String,
      github: String,
      instagram: String,
    },
    experience: [
      { company: String, role: String, period: String, description: String },
    ],
    metaDescription: String,
  },
  { timestamps: true },
);

export default mongoose.models.Profile ||
  mongoose.model("Profile", ProfileSchema);
