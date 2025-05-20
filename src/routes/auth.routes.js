import express from "express";
import {
  login,
  register,
  verifySignUpToken,
} from "../controllers/auth/auth.controller.js";
// import { registerSchema } from "../validations/user/index.js";
// import { validateRequest } from "../middlewares/validateRequest.js";
// import passport from "passport";

const router = express.Router();

router.route("/register").post(register); // put validateRequest(registerSchema), register);
router.route("/login").post(login);
router.route("/verify-signup/:token").get(verifySignUpToken);
// Auth Routes
// router.route("/login").get(passport.authenticate("openidconnect"));

// Callback URL (where the IdP will redirect after login)
// router
//   .route("/auth/callback")
//   .get(
//     passport.authenticate("openidconnect", { failureRedirect: "/" }),
//     (req, res) => {
//       res.redirect("/"); // Change this to your desired route after login
//     }
//   );

// // Logout route
// router.get("/logout", (req, res) => {
//   req.logout(() => {
//     res.redirect("/");
//   });
// });

export default router;
