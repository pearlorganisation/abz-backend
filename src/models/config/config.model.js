import mongoose from "mongoose";
import { CONFIG_KEYS } from "../../../constants.js";

const configSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "Config key is required"],
      trim: true,
      unique: [true, "Config key must be unique"],
      enum: CONFIG_KEYS, // can add dynamically to
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
