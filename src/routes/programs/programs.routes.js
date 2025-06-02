import express from "express";
import { createProgram } from "../../controllers/program/program.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/").post(upload.single("program_profile"), createProgram);

export default router;
