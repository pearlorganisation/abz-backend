import express from "express";
import {
  createAsset,
  deleteAssetById,
  updateAssetById,
} from "../../controllers/asset/asset.controller.js";

const router = express.Router();

router.route("/").post(createAsset);
router.route("/:id").patch(updateAssetById).delete(deleteAssetById);
export default router;
