import mongoose, { Schema } from "mongoose";

const ImageBlockSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: String,
    caption: String,
  },
  { _id: false },
);

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

    personas: [ImageBlockSchema],
    process: [ImageBlockSchema],
    designSystem: [ImageBlockSchema],

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
