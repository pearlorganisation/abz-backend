import mongoose from "mongoose";
import { PROGRAM_TYPES } from "../../../constants";

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
      //Step 1
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, "Program username must be at least 3 characters"],
      maxlength: [30, "Program username must be at most 30 characters"],
      match: [
        /^(?!.*[.-]{2})(?!.*[.-]$)[a-zA-Z0-9][a-zA-Z0-9._-]{2,29}$/,
        "Username must start with a letter or number, can include '.', '-', '_' (no consecutive dots or hyphens, and can't end with them)",
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
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    //====Participation Guidelines
    conduct: { type: Boolean }, // Indicates if the program follows a code of conduct
    non_target: { type: Boolean },
    public_disclosure: { type: Boolean }, // Indicates if the program allows public disclosure of vulnerabilities

    ///======Specific Areas of Concern
    program_policy: { type: String }, // Specific area of concerns section

    //===Additional Details
    program_additional_details: [{}],
    //===
    program_type: {
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
