import express from "express";
import multer from "multer";
import {
  createTestimonial,
  getAllTestimonials,
  updateTestimonialById,
  deleteTestimonialById,
} from "../../controllers/testimonial/testimonial.controller.js";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/", upload.single("image"), createTestimonial);
router.get("/", getAllTestimonials);
router.put("/:id", upload.single("image"), updateTestimonialById);
router.delete("/:id", deleteTestimonialById);

export default router;
