import mongoose from "mongoose";

const { Schema, model } = mongoose;

const programSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "invite-only"],
      default: "public",
    },
    disclosurePolicy: {
      type: String,
      enum: ["public", "coordinated", "confidential"],
    },
    scopes: {
      in: [
        {
          type: String,
        },
      ],
      out: [
        {
          type: String,
        },
      ],
    },
    rewardTiers: {
      low: {
        type: Number,
      },
      medium: {
        type: Number,
      },
      high: {
        type: Number,
      },
      critical: {
        type: Number,
      },
    },
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },
    attachments: [
      {
        type: String, // URLs to media or documents
      },
    ],
    invitedResearchers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Program = model("Program", programSchema);

export default Program;
