import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 60,
      },
      handle: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
      },
      avatar: {
        type: String,
        default: "",
      },
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    imageUrl: {
      type: String,
      default: "",
      maxlength: 2048,
    },
    likes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });

export default mongoose.model("Post", postSchema);