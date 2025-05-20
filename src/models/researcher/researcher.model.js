// models/Researcher.js
import mongoose from "mongoose";

const researcherSchema = new mongoose.Schema(
  {
    thanks_recieved: {
      type: Number,
      default: 0,
    },
    social_links: {
      twitter: String,
      linkedin: String,
      github: String,
    },
    bugs_reported: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BugReport",
      },
    ],
  },
  { timestamps: true }
);

const Researcher = mongoose.model("Researcher", researcherSchema);

export default Researcher;
