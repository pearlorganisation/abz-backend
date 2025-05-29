import express from "express";
import multer from "multer";
import {
  createPartner,
  getAllPartners,
  updatePartnerById,
  deletePartnerById,
} from "../../controllers/partner/partner.controller.js";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/", upload.single("image"), createPartner);
router.get("/", getAllPartners);
router.put("/:id", upload.single("image"), updatePartnerById);
router.delete("/:id", deletePartnerById);

export default router;
