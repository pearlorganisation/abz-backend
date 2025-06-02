import mongoose from "mongoose";
import { PROGRAM_TYPES } from "../../../constants.js";

const { Schema, model } = mongoose;

const programSchema = new Schema(
  {
    //Brand your Program
    program_profile: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    program_name: {
      type: String,
      required: true,
      trim: true,
    },
    program_username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, "Program username must be at least 3 characters"],
      maxlength: [30, "Program username must be at most 30 characters"],
      match: [
        /^(?!.*[.-]{2})(?!.*[.-]$)[a-z0-9][a-z0-9._-]{2,29}$/,
        "Username must start with a lowercase letter or number, can include '.', '-', '_' (no consecutive dots or hyphens, and can't end with them)",
      ],
    },
    program_tagline: {
      type: String,
      required: true,
      trim: true,
    },
    porgram_webiste: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/[\w.-]*)*$/,
        "Please enter a valid URL",
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    // Define scope
    scope_groups: [
      {
        group_name: { type: String, required: true }, //🔴
        is_in_scope: { type: Boolean, required: true }, //🔴
        group_labels: {
          key: { type: String, required: true },
          values: [{ type: String, required: true }],
        },
        assets: [
          //🔴
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Asset",
            required: true,
          },
        ],
      },
    ],
    //====Participation Guidelines
    conduct: { type: Boolean, default: false },
    non_target: { type: Boolean, default: false },
    public_disclosure: { type: Boolean, default: false },

    ///======Specific Areas of Concern
    program_policy: { type: String }, // Specific area of concerns section

    //===Additional Details
    program_additional_details: [
      //🔴
      {
        key: { type: String, required: true, trim: true },
        values: [{ type: String, required: true, trim: true }],
      },
    ],
    //Rules of Engagement
    program_rules_of_engagement: {
      // Not required
      is_reporter_ip: { type: Boolean, default: false },
      is_collab_allow: { type: Boolean, default: false },
      user_agent: { type: String },
      automated_tooling: { type: Number },
      request_header: { type: String },
    },
    //===
    program_type: {
      //🔴
      type: String,
      enum: PROGRAM_TYPES,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Program = model("Program", programSchema);

export default Program;
