import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
    },
    twitter_handle: {
      type: String,
      unique: true,
      trim: true,
    },
    industry: {
      type: String,
    },
    headquarters: {
      type: String,
    },
    programs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
    ],
    is_approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // optional: adds createdAt and updatedAt fields
  }
);

const Company = mongoose.model("Company", companySchema);

export default Company;
