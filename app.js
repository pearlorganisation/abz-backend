import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import path from "path";
import "./src/config/passport.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Session configuration
app.use(
  session({
    secret: "F5B47E896766EE2C", // Session secret
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? [
            "http://localhost:3000",
            "http://localhost:3002",
            "http://localhost:3001",
          ]
        : ["https://abz-frontend-one.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

//Routes Imports
import authRouter from "./src/routes/auth.routes.js";
import partnerRouter from "./src/routes/partners/partner.routes.js";
import testmonialsRouter from "./src/routes/testimonials/testimonials.routes.js";
import configRouter from "./src/routes/config/config.routes.js";
import assetRouter from "./src/routes/asset/asset.routes.js";
import programRouter from "./src/routes/programs/programs.routes.js";
import { errorHandler } from "./src/utils/error/errorHanlder.js";

app.get("/", (req, res) => {
  res.status(200).send("APIs are working...");
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/partners", partnerRouter);
app.use("/api/v1/testmonials", testmonialsRouter);
app.use("/api/v1/configs", configRouter);
app.use("/api/v1/assets", assetRouter);
app.use("/api/v1/programs", programRouter);

app.use(errorHandler);

export { app };
