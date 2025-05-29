import express from "express";
import { createConfig } from "../../controllers/config/config.controller.js";

const router = express.Router();

router.route("/").post(createConfig);

export default router;
