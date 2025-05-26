import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
//       enum: ["image", "video", "document", "other"], // you can customize this list
    },
    labels: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { timestamps: true }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
