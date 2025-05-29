import express from "express";
import {
  createConfig,
  deleteConfigBykey,
  getAllConfigs,
  updateConfigByKey,
} from "../../controllers/config/config.controller.js";

const router = express.Router();

router.route("/").post(createConfig).get(getAllConfigs);
router.route("/:key").patch(updateConfigByKey).delete(deleteConfigBykey);

export default router;
