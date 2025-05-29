import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Asset URL is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^https:\/\/.+/.test(v); // Only allow URLs starting with https://
        },
        message: "URL must start with https://",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    asset_type: {
      type: String,
      required: [true, "Asset type is required"],
      trim: true,
    },
    asset_labels: [
      {
        type: String,
        trim: true,
        minLength: [1, "Labels cannot be empty strings"],
      },
    ],
  },
  { timestamps: true }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
