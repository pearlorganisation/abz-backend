import mongoose from "mongoose";
import { PROGRAM_TYPES } from "../../../constants";

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
      enum: ["PUBLIC", "INVITE_ONLY"], //invite_only is used for private programs
      default: "PUBLIC",
    },
    disclosure_policy: {
      type: String,
      enum: ["PUBLIC", "COORDINATED", "CONFEDENTIAL"],
    },
    program_type: {
      type: String,
      enum: PROGRAM_TYPES,
      required: true,
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
    reward_tiers: {
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
      enum: ["DRAFT", "ACTIVE", "ARCHIVED"],
      default: "DRAFT",
    },
    attachments: [
      {
        type: String, // URLs to media or documents
      },
    ],
    invited_researchers: [
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
