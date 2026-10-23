import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: String,
    role: String,
    client: String,
    year: Number,
    duration: String,
    team: [String],
    tools: [String],
    tags: [String],
    coverImage: String,
    coverImageAlt: String,
    gallery: [{ url: String, alt: String, caption: String }],
    links: { live: String, prototype: String, figma: String },
    introduction: String,
    challenge: String,
    goals: [String],
    personas: [
      {
        name: String,
        role: String,
        bio: String,
        goals: [String],
        frustrations: [String],
        image: String,
      },
    ],

    process: [
      {
        phase: String,
        description: String,
        image: String,
      },
    ],
    designSystem: {
      typography: [{ name: String, usage: String, sampleText: String }],
      colorPalette: [{ name: String, hex: String, usage: String }],
      notes: String,
    },
    solution: String,
    outcomes: [{ label: String, value: String }],
    reflection: String,
    content: Schema.Types.Mixed,
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    metaDescription: String,
  },
  { timestamps: true },
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
