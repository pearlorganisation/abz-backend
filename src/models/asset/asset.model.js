import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    description: { type: String, required: true },
    asset_type: { type: String, required: true },
    asset_labels: [{ type: String, required: false }],
  },
  { timestamps: true }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
