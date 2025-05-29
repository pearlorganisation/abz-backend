import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: ["asset_types", "asset_labels"], // can add dynamically to
    },
    values: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

const Config = mongoose.model("Config", configSchema);

export default Config;
