import express from "express";
import {
  createProgram,
  deleteProgramById,
  getAllPrograms,
  updateProgram,
} from "../../controllers/program/program.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(upload.single("program_profile"), createProgram)
  .get(getAllPrograms);

router
  .route("/:programUsername")
  .patch(upload.single("program_profile"), updateProgram);

router.route("/:id").delete(deleteProgramById);

export default router;
